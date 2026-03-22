// ============================================================================
// AGENTIC PROPOSAL ENGINE
// ============================================================================
// This serverless function is an AI AGENT — not a script.
// You give Claude tools and a goal. Claude decides what to do.
//
// Flow: Visitor completes intake chat → this function receives the conversation
//       → Claude writes a proposal, renders a PDF, emails it, and alerts you
//       → All autonomously, in 2-3 turns
//
// Tools: 3 core (render PDF, send email, alert owner)
//        + 1 optional (store lead in Supabase — enabled when env vars present)
//
// Works with: Express (local dev via server.js) and Vercel (production)
// ============================================================================

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

// ── Tool definitions for Claude ─────────────────────────────────────────────
// These are the "hands" Claude can use. Claude decides WHEN and HOW to use them.

const CORE_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'render_proposal_pdf',
      description: 'Renders a branded proposal PDF. Returns base64-encoded PDF data.',
      parameters: {
        type: 'object',
        properties: {
          company_name: { type: 'string', description: 'The prospect company name' },
          contact_name: { type: 'string', description: 'The prospect contact name' },
          sections: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                heading: { type: 'string' },
                body: { type: 'string' },
              },
              required: ['heading', 'body'],
            },
            description: 'Proposal sections, each with a heading and body text',
          },
        },
        required: ['company_name', 'contact_name', 'sections'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'send_email',
      description: 'Sends an email to the prospect with optional PDF attachment.',
      parameters: {
        type: 'object',
        properties: {
          to: { type: 'string', description: 'Recipient email address' },
          subject: { type: 'string', description: 'Email subject line' },
          body: { type: 'string', description: 'Email body text (plain text)' },
          attach_pdf: { type: 'boolean', description: 'Whether to attach the proposal PDF' },
        },
        required: ['to', 'subject', 'body'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'alert_owner',
      description: 'Sends a Telegram alert to the owner with lead summary and proposal PDF.',
      parameters: {
        type: 'object',
        properties: {
          message: { type: 'string', description: 'Alert message text including lead score (HIGH/MEDIUM/LOW)' },
        },
        required: ['message'],
      },
    },
  },
];

// Optional tool — only available if Supabase is configured (Power Up: Lead Storage)
const STORE_LEAD_TOOL = {
  type: 'function',
  function: {
    name: 'store_lead',
    description: 'Stores the lead in the CRM database with score and conversation data.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Contact name' },
        company: { type: 'string', description: 'Company name' },
        email: { type: 'string', description: 'Contact email' },
        industry: { type: 'string', description: 'Company industry' },
        challenge: { type: 'string', description: 'Their main challenge (1-2 sentences)' },
        budget: { type: 'string', description: 'Budget range mentioned' },
        score: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'], description: 'Lead score based on triage rules' },
        status: { type: 'string', description: 'Lead status, e.g. proposal_sent' },
      },
      required: ['name', 'company', 'email', 'score', 'status'],
    },
  },
};

// Build tools list — Supabase tool is included only when configured
function getTools() {
  const tools = [...CORE_TOOLS];
  if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    tools.push(STORE_LEAD_TOOL);
  }
  return tools;
}

// ── PDF text sanitizer ──────────────────────────────────────────────────────
// pdf-lib standard fonts only support WinAnsi encoding (basic ASCII).
// AI-generated text WILL contain characters that crash PDF rendering.
// This function MUST run on ALL text before any drawText() call.

function sanitizeForPdf(text) {
  if (!text) return '';
  return text
    // Currency symbols → text equivalents
    .replace(/₹/g, 'INR ')
    .replace(/€/g, 'EUR ')
    .replace(/£/g, 'GBP ')
    // Dashes → hyphen
    .replace(/[\u2013\u2014\u2015]/g, '-')
    // Curly quotes → straight quotes
    .replace(/[\u2018\u2019\u201A]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2039\u203A]/g, "'")
    .replace(/[\u00AB\u00BB]/g, '"')
    // Ellipsis → three dots
    .replace(/\u2026/g, '...')
    // Special spaces → regular space
    .replace(/[\u00A0\u2002\u2003\u2007\u202F]/g, ' ')
    // Bullets and symbols → ASCII equivalents
    .replace(/[\u2022\u2023\u25E6\u2043]/g, '-')
    .replace(/\u2713/g, '[x]')
    .replace(/\u2717/g, '[ ]')
    .replace(/\u00D7/g, 'x')
    .replace(/\u2192/g, '->')
    .replace(/\u2190/g, '<-')
    .replace(/\u2264/g, '<=')
    .replace(/\u2265/g, '>=')
    // Catch-all: remove anything outside printable ASCII + newlines/tabs
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '');
}

// ── Tool implementations ────────────────────────────────────────────────────

let proposalPdfBase64 = null; // Stored in memory for the email attachment step

async function renderProposalPdf({ company_name, contact_name, sections }) {
  // Sanitize ALL text before rendering
  company_name = sanitizeForPdf(company_name);
  contact_name = sanitizeForPdf(contact_name);
  sections = sections.map(s => ({
    heading: sanitizeForPdf(s.heading),
    body: sanitizeForPdf(s.body),
  }));

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // Brand colors — matched to website (navy + warm gold)
  const brandPrimary = rgb(0.1, 0.23, 0.36);    // navy #1a3a5c
  const brandAccent = rgb(0.78, 0.51, 0.23);    // warm gold #c8833a
  const black = rgb(0.1, 0.1, 0.1);
  const gray = rgb(0.35, 0.35, 0.35);

  // ── Cover page ──
  const cover = pdf.addPage([612, 792]);
  // Header bar
  cover.drawRectangle({ x: 0, y: 692, width: 612, height: 100, color: brandPrimary });
  cover.drawText('Pankaj Goel', {
    x: 50, y: 732, size: 22, font: fontBold, color: rgb(1, 1, 1),
  });
  cover.drawText('Senior Sales Director  |  Enterprise IT Services  |  UK', {
    x: 50, y: 710, size: 11, font, color: rgb(0.8, 0.8, 0.8),
  });
  // Proposal title
  cover.drawText('PROPOSAL', {
    x: 50, y: 600, size: 36, font: fontBold, color: brandPrimary,
  });
  cover.drawText(`Prepared for ${contact_name}`, {
    x: 50, y: 565, size: 16, font, color: black,
  });
  cover.drawText(company_name, {
    x: 50, y: 542, size: 14, font, color: gray,
  });
  cover.drawText(
    new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    { x: 50, y: 510, size: 12, font, color: gray }
  );

  // ── Content pages ──
  let y = 720;
  let page = pdf.addPage([612, 792]);
  const maxWidth = 500;

  // Helper: draw a line of text, adding a new page if needed
  function drawLine(text, options) {
    if (y < 60) { page = pdf.addPage([612, 792]); y = 720; }
    page.drawText(text, { x: 50, y, ...options });
    y -= options.lineHeight || 18;
  }

  for (const section of sections) {
    if (y < 120) {
      page = pdf.addPage([612, 792]);
      y = 720;
    }

    // Section heading with accent line above
    page.drawLine({
      start: { x: 50, y: y + 20 }, end: { x: 120, y: y + 20 },
      thickness: 2, color: brandAccent,
    });
    drawLine(section.heading, { size: 16, font: fontBold, color: brandPrimary, lineHeight: 28 });

    // Section body — split on newlines first, then word-wrap each paragraph
    const paragraphs = section.body.split('\n');
    for (const paragraph of paragraphs) {
      if (paragraph.trim() === '') {
        y -= 10; // blank line spacing
        continue;
      }
      const words = paragraph.split(' ');
      let line = '';
      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, 11);
        if (width > maxWidth && line) {
          drawLine(line, { size: 11, font, color: black });
          line = word;
        } else {
          line = testLine;
        }
      }
      if (line) {
        drawLine(line, { size: 11, font, color: black });
      }
    }
    y -= 20; // space between sections
  }

  // ── Footer on last page ──
  const lastPage = pdf.getPages()[pdf.getPageCount() - 1];
  lastPage.drawText('Pankaj Goel  |  goelji@gmail.com  |  UK', {
    x: 50, y: 30, size: 9, font, color: gray,
  });

  const pdfBytes = await pdf.save();
  proposalPdfBase64 = Buffer.from(pdfBytes).toString('base64');
  return { success: true, pages: pdf.getPageCount(), size_kb: Math.round(pdfBytes.length / 1024) };
}

async function sendEmail({ to, subject, body, attach_pdf }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: 'RESEND_API_KEY not configured' };

  const payload = {
    from: 'Pankaj Goel <onboarding@resend.dev>',
    to,
    subject,
    text: body,
  };

  if (attach_pdf && proposalPdfBase64) {
    payload.attachments = [{
      filename: 'proposal.pdf',
      content: proposalPdfBase64,
    }];
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error:', err);
    return { success: false, error: `Resend API error: ${res.status}` };
  }

  const data = await res.json();
  return { success: true, email_id: data.id };
}

async function storeLead(leadData) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) return { success: false, error: 'Supabase not configured' };

  // Fields match the leads table schema:
  // name, company, email, industry, challenge, budget, score, status
  // conversation_transcript and created_at are handled separately
  const row = {
    name: leadData.name || null,
    company: leadData.company || null,
    email: leadData.email || null,
    industry: leadData.industry || null,
    challenge: leadData.challenge || null,
    budget: leadData.budget || null,
    score: leadData.score || null,
    status: leadData.status || 'proposal_sent',
  };

  const res = await fetch(`${url}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Supabase error:', err);
    return { success: false, error: `Supabase error: ${res.status}` };
  }

  return { success: true };
}

async function alertOwner({ message }) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return { success: false, error: 'Telegram not configured' };

  // Send text alert
  const textRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  });

  if (!textRes.ok) {
    const err = await textRes.text();
    console.error('Telegram error:', err);
    return { success: false, error: `Telegram error: ${textRes.status}` };
  }

  // Send proposal PDF if available
  if (proposalPdfBase64) {
    const pdfBuffer = Buffer.from(proposalPdfBase64, 'base64');
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', new Blob([pdfBuffer], { type: 'application/pdf' }), 'proposal.pdf');
    formData.append('caption', 'Proposal PDF attached');

    await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: 'POST',
      body: formData,
    });
  }

  return { success: true };
}

// ── Tool dispatcher ─────────────────────────────────────────────────────────

async function executeTool(name, args) {
  switch (name) {
    case 'render_proposal_pdf': return renderProposalPdf(args);
    case 'send_email':          return sendEmail(args);
    case 'store_lead':          return storeLead(args);
    case 'alert_owner':         return alertOwner(args);
    default:                    return { error: `Unknown tool: ${name}` };
  }
}

// ── Agent system prompt ─────────────────────────────────────────────────────
// [CUSTOMIZE] Claude will replace everything below with YOUR identity, voice,
// services, and triage rules from your CLAUDE.md.

const AGENT_SYSTEM_PROMPT = `You are an AI agent acting on behalf of Pankaj Goel.

You have received intake data from a website visitor. Your job:
1. Write a personalised proposal in Pankaj's voice
2. Score the lead using the triage rules below
3. Use your tools to: render the proposal as a PDF, email it to the visitor, store the lead (if store_lead tool is available), and alert Pankaj on Telegram

## PANKAJ'S IDENTITY

Pankaj Goel is a Senior Sales Director with 25 years in IT services, based in the UK. He works with enterprise clients in retail, consumer, and marketplace sectors. He operates at CIO and C-suite level — this is where his network, credibility, and commercial track record sit. He has opened 15 net-new enterprise logos across his career, including Richemont, Compass Group, Barry Callebaut, and Network Rail.

## HIS SERVICES

- New logo opening — identifying, approaching, and converting net-new enterprise clients at senior level. Pankaj gets the first meeting where others can't. 15 new logos opened across career.
- Agentic AI transformation programmes — shaping and selling end-to-end AI transformation engagements at CIO/C-suite level in retail, consumer, and marketplace. Translates capability into business outcomes that land with CIOs and CFOs.
- Go-to-market advisory — building the pursuit strategy, account plan, pricing approach, and commercial positioning that closes complex enterprise deals. Full cycle: from first meeting to signed contract.

## HIS VOICE — WRITE IN THIS STYLE

- Evidence-first: back every claim with a number, name, or outcome. Not "senior relationships" — "CIO and CFO level at Fortune 500 accounts." Not "large programmes" — "15 net-new logos opened across 25 years."
- Active voice, strong verbs: spearheaded, orchestrated, drove, cultivated, secured, unlocked, navigated. Never passive.
- Name the gap, then reframe it: state weaknesses directly, then pivot to why it does not matter or is actually an advantage.
- Rich but accessible vocabulary: "pivotal" not "paradigm-shifting", "sizeable" not "substantial quantum", "sharp" not "exceptional."
- No filler: no "excited to share", no "leverage synergies", no "I hope this finds you well", no vague quality claims without proof.
- UK English throughout. Structured bullets, active voice, every claim backed by a number or name, clean close.

## LEAD TRIAGE RULES

Score each lead HIGH, MEDIUM, or LOW:

HIGH — all three present:
- Sector: retail, consumer, or marketplace. Enterprise scale (500+ employees, UK/Europe). CIO or equivalent.
- Problem: stuck pipeline / no new logo traction, Agentic AI on the agenda with no route to market, a specific deal to win, or go-to-market strategy not landing.
- Budget: mentions GBP 50k+ engagement, has budget allocated, or problem scale implies it.
Additional HIGH signals: names a specific account they are targeting, has already tried something that failed, operating at or selling to CIO/CFO level, has a deadline or commercial pressure.

MEDIUM — worth a proposal, qualify further:
- Adjacent sector (financial services, manufacturing, logistics) with similar enterprise dynamics.
- Problem is real but vague — "we need to grow revenue" without specifics.
- Budget unclear or hesitant.
- Mid-market company (100–500 employees).
- Startup wanting enterprise go-to-market advice.

LOW — lightweight response only:
- SME or startup, sub-100 employees, no enterprise sales motion.
- Sector has no overlap with retail, consumer, marketplace, or enterprise IT services.
- No budget signal, problem is exploratory.
- Wants execution resources (a salesperson to make calls) not senior advisory.
- Challenge is operational/technical, not commercial or go-to-market.

## PROPOSAL STRUCTURE

Write 4-5 sections tailored to their specific situation:
1. Understanding Your Challenge — show you listened; reference their exact words and context
2. Recommended Approach — what Pankaj would do, specific to their problem, backed by relevant experience
3. Proposed Engagement — which service, scope, and indicative timeline
4. Investment — pricing range based on scope (advisory engagements typically start at GBP 15k–25k for a focused sprint; larger pursuits GBP 50k+)
5. Next Steps — what happens after they review the proposal

## INSTRUCTIONS

- Write the proposal in Pankaj's voice — direct, personal, specific to the visitor's situation
- Score the lead using the triage rules (HIGH / MEDIUM / LOW)
- Call render_proposal_pdf with the proposal sections
- Call send_email with a warm, short covering email and the PDF attached
- If the store_lead tool is available, call it with all lead data and the score
- Call alert_owner with: company, contact name, challenge summary, score, and one sentence on why that score
- Format the score in the alert as: SCORE: HIGH (or MEDIUM / LOW)
- You decide the order. You can call render_proposal_pdf and store_lead simultaneously — but send_email and alert_owner must wait until the PDF is rendered.`;

// ── Main handler ────────────────────────────────────────────────────────────
// Works as both Express route (local dev) and Vercel serverless function

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { conversation, intakeData } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' });

  if (!conversation && !intakeData) {
    return res.status(400).json({ error: 'conversation or intakeData required' });
  }

  // Reset PDF state for this request
  proposalPdfBase64 = null;

  // Build context from intake data or conversation transcript
  const intakeContext = intakeData
    ? `VISITOR INTAKE DATA:\n${JSON.stringify(intakeData, null, 2)}`
    : `CONVERSATION TRANSCRIPT:\n${conversation.map(m => `${m.role}: ${m.content}`).join('\n')}`;

  // Build tools list — store_lead only available if Supabase is configured
  const tools = getTools();
  const supabaseEnabled = tools.some(t => t.function?.name === 'store_lead');
  console.log(`Agent starting with ${tools.length} tools${supabaseEnabled ? ' (Supabase enabled)' : ''}`);

  let messages = [
    { role: 'system', content: AGENT_SYSTEM_PROMPT },
    { role: 'user', content: `${intakeContext}\n\nPlease write a personalized proposal, score this lead, and use your tools to send everything.` },
  ];

  const results = { proposal: false, email: false, stored: false, alerted: false };

  // ── Agent loop — max 5 turns for safety ──
  for (let turn = 1; turn <= 5; turn++) {
    console.log(`Agent turn ${turn}...`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': req.headers?.host ? `https://${req.headers.host}` : 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4.6',
        messages,
        tools,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Agent OpenRouter error:', err);
      return res.status(502).json({ error: 'Agent API call failed', details: err });
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    if (!choice) {
      console.error('Agent: no choice in response');
      break;
    }

    const assistantMessage = choice.message;
    messages.push(assistantMessage);

    // No tool calls = agent is done thinking
    if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
      console.log(`Agent turn ${turn}... Agent completed.`);
      break;
    }

    // Execute each tool call
    const toolNames = assistantMessage.tool_calls.map(tc => tc.function.name);
    console.log(`Agent turn ${turn}... Claude called ${assistantMessage.tool_calls.length} tool(s): ${toolNames.join(', ')}`);

    for (const toolCall of assistantMessage.tool_calls) {
      let args;
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch (e) {
        console.error(`Failed to parse tool args for ${toolCall.function.name}:`, e.message);
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify({ error: 'Failed to parse arguments' }),
        });
        continue;
      }

      const result = await executeTool(toolCall.function.name, args);

      // Track what succeeded
      if (toolCall.function.name === 'render_proposal_pdf' && result.success) results.proposal = true;
      if (toolCall.function.name === 'send_email' && result.success) results.email = true;
      if (toolCall.function.name === 'store_lead' && result.success) results.stored = true;
      if (toolCall.function.name === 'alert_owner' && result.success) results.alerted = true;

      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }
  }

  console.log('Agent pipeline complete:', results);
  return res.json({ success: true, results });
};
