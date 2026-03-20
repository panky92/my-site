# Day 2: Your Team's First Project — Ship Your AI Sales Engine

> **Which handbook is this?** This is the **Full** version — 5 steps, all mandatory, deeper build. Best for students on the **Max plan** who have tokens to burn and want the complete experience: two HTML design variations, an expert roast panel, logo generation, and research-informed polish — all baked into the core flow. If you'd prefer a lighter core that ships faster and lets you pick optional add-ons at your own pace, use **student-handbook-core-plus-addon.md** instead.

**Duration:** Full day (10:00 AM – 5:00 PM) | **One build, five steps, one live URL with an AI agent by 5 PM**

---

## What You're Building Today

Yesterday you built a team. Today you put that team to work and ship a **branded website with an AI sales agent** — live on the internet, working 24/7.

By the end of today, you'll have:

1. A professional branded website — deployed to a live URL
2. An AI chatbot that answers visitors **in your voice**
3. A proposal engine that generates **personalized PDFs** per visitor
4. Automatic email delivery — proposals emailed to visitors with attachments
5. Lead alerts on your phone — Telegram/email notification with qualification score
6. Human-in-the-loop approval — you review before the agent sends

**Not a static page. Not a chatbox. An agent that qualifies leads, writes proposals in your voice, emails them, and alerts you — all without you touching anything.**

---

## What You Need From Day 1

Today's build runs on everything you built yesterday. Here's a quick check:

| Day 1 Artifact                  | Where it is                                 | Day 2 uses it for                                                                          |
| ------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **CLAUDE.md**                   | Root of your project                        | Chatbot system prompt — answers visitors using your context                                |
| **"What I Offer" section**      | Inside CLAUDE.md                            | Chatbot explains your services. Proposals scope recommendations.                           |
| **Voice fingerprint**           | CLAUDE.md "My Writing Voice" section        | Chatbot speaks like you. Proposals written like you. Emails sound like you.                |
| **Comms Lead skill**            | `.claude/skills/write-in-my-voice/`         | Generates copy for your website, proposal text, email drafts                               |
| **Research output**             | `research/synthesis.md`                     | Competitive positioning on your site. Informs proposal content.                            |
| **Advisory board pattern**      | `evaluation/TEMPLATE-advisory-board.md`     | Expert roast panel that critiques your site before shipping                                |
| **Chief of Staff triage rules** | CLAUDE.md "Chief of Staff Operating Manual" | Lead scoring: HIGH/MEDIUM/LOW using the same framework                                     |
| **Telegram bot token**          | From Day 1 setup                            | Lead alerts — your phone buzzes when visitors request proposals                            |
| **Gmail account**               | Created during Day 1 pre-work               | Chief of Staff email triage. Day 2 email sending uses Resend (set up in Step 4C).          |

### Quick verification (5 min)

Run through this before we start:

```
Read my CLAUDE.md. Confirm you can see:
1. Who I am and what I do
2. My "What I Offer" section (services, expertise, typical clients)
3. My "Writing Voice" section (tone, patterns, quirks)
4. My "Chief of Staff Operating Manual" (triage rules, key people)

Tell me if anything is missing or too thin for building a website and chatbot today.
```

If something's missing, spend 5 minutes enriching it now. It's easier to add context now than to debug a generic-sounding chatbot later.

---

## Schedule

| Time          | Step                        | What's Happening                                                       | Day 1 Team Used                                      |
| ------------- | --------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------- |
| 10:00 – 10:15 | Kickoff                     | Recap, verify, set the stage                                           | —                                                    |
| 10:15 – 11:45 | **Step 1: Brand & Design**  | Brief → 2 copy variations → 2 designs → compare → combine → logo      | Comms Lead (voice), Researcher (positioning)         |
| 11:45 – 11:55 | _Break_                     |                                                                        |                                                      |
| 11:55 – 12:45 | **Step 2: Roast & Fix**     | Expert roast → prioritized fixes → polished site                       | Advisory Board (roast pattern)                       |
| 12:45 – 1:25  | _Lunch_                     |                                                                        |                                                      |
| 1:25 – 2:10   | **Step 3: The Chatbot**     | Chat widget + Claude API + voice fingerprint → test locally            | Comms Lead (voice), CLAUDE.md (context)              |
| 2:10 – 3:25   | **Step 4: Proposal Engine** | Agentic tool use → PDF → email → lead scoring → test locally           | Chief of Staff (triage rules), Telegram bot (alerts) |
| 3:25 – 3:35   | _Break_                     |                                                                        |                                                      |
| 3:35 – 4:35   | **Step 5: Deploy & Demo**   | Push to GitHub → deploy to Vercel → add env vars → debug → live demo  | Everything                                           |
| 4:35 – 4:55   | **Show & Tell**             | Live demos, live URLs, war stories                                    | Everything                                           |
| 4:55 – 5:00   | Close                       | What you built. What carries forward.                                  |                                                      |

---

## Verify the Frontend Design Skill

Today's build generates production-quality HTML. The `frontend-design` skill gives Claude the design knowledge to produce polished, professional layouts. You installed it during Day 1 — let's verify it's active.

Run:

```
/frontend-design
```

Then ask Claude:

```
Confirm you have the frontend-design skill loaded
```

If Claude confirms the skill is active, you're set. Move on to Getting Started.

> **Didn't install it on Day 1?** Follow these steps:
>
> 1. Run: `/plugin marketplace add anthropics/claude-code`
> 2. Run: `/plugin install frontend-design@anthropics-claude-code`
> 3. Exit Claude (`/exit`) and restart (`claude`) — the skill loads on startup
> 4. Run `/frontend-design` and verify it's active
>
> If it still won't load, skip it — your site will work fine, just with less design polish.

---

## Getting Started

Open your terminal and navigate to today's build folder:

```bash
cd ~/thecrux-bootcamp/day2-guided-build
```

Copy your Day 1 artifacts into this folder — everything your team built yesterday:

```bash
cp -r ~/thecrux-bootcamp/day1-guided-build/CLAUDE.md .
cp -r ~/thecrux-bootcamp/day1-guided-build/.claude .
cp -r ~/thecrux-bootcamp/day1-guided-build/research .
cp -r ~/thecrux-bootcamp/day1-guided-build/evaluation .
```

Start Claude:

```bash
claude
```

> **Note:** The `my-site/` subfolder doesn't exist yet — Claude will create it during Step 1 when you build your website.

---

## Kickoff (10:00 – 10:15)

Yesterday you built a team — researcher, comms lead, advisory board, chief of staff. Today you give that team a real project.

**The brief:** Build a branded website that works as your AI sales agent. A visitor finds your site, chats with an AI that sounds like you, describes what they need, and receives a personalized proposal in their inbox — all without you lifting a finger. Your phone buzzes with a lead alert. You review the proposal. You approve it. The visitor gets it. That's what we're shipping today.

Make sure you have your `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` from Day 1 handy — you'll need them in Step 4 for lead alerts.

---

## Step 1: Brand & Design (90 min)

**What you're building:** Your branded website — professional, polished, ready to deploy.

**Day 1 artifacts used:** CLAUDE.md (identity + offerings), voice fingerprint (copy tone), research output (competitive positioning)

### 1A: The Brief (10 min)

Tell Claude what you're building. Be specific — the more context, the better the output.

```
I want to build a professional branded website for my practice/business.
Read my CLAUDE.md for who I am, what I offer, and my voice.
Read research/synthesis.md for competitive context.

Based on this, create a brief for my website:
- What the hero section should say (in MY voice, not a template)
- What services/offerings to highlight (from my "What I Offer" section)
- What makes me different (from my research + CLAUDE.md)
- What the CTA should be
- Who the target visitor is

Don't write the copy yet — just the brief. I want to review before we generate.
```

Review the brief. Adjust anything that feels off. This is the blueprint for everything.

### 1B: Two Copy Variations (15 min)

Now generate two different copywriting angles — in parallel. Same brief, different approaches.

```
Based on the brief we just created, generate TWO complete copy variations
for my website. Each should be a full set of copy (hero, about, services,
testimonials placeholders, CTA, contact).

Variation A: Lead with my story — personal, founder-narrative angle.
Why I do this work. Make it feel human.

Variation B: Lead with the outcome — ROI-driven, results-focused.
What the client gets. Make it feel sharp and credible.

Both must be written in MY voice — reference my CLAUDE.md and voice DNA.
Both should use real details from my "What I Offer" section.

Write both to separate files:
- copy-variation-a.md
- copy-variation-b.md
```

Read both. You'll cherry-pick the best elements from each.

### 1C: Two Design Variations (20 min)

Now generate two visually distinct websites. Instead of picking a style yourself, let Claude read your context and propose two design directions that fit **who you are**.

```
Read my CLAUDE.md — my identity, industry, voice, the kind of clients I
work with. Read the copy variations you just wrote. Read research/synthesis.md
for competitive context.

Based on all of this, propose TWO design directions that would resonate
with my target audience and reflect my brand personality. Explain each
direction in 2-3 sentences — what it looks like, what it feels like, and
why it fits me. Don't build yet — just propose.
```

Review the two directions. Adjust if something feels off. Then:

```
Build both designs.

Design 1 (using Copy A): [the first direction you proposed]
Design 2 (using Copy B): [the second direction you proposed]

Apply frontend-design skill standards to all HTML output: strong visual
hierarchy, professional typography, purposeful whitespace, smooth hover
states on CTAs, production-grade polish.

Both must be:
- Single page, responsive, mobile-friendly
- HTML + CSS + JS, no framework
- Professional typography and spacing
- Include: hero, about, services, testimonials, CTA, contact form

Save as:
- design-v1/index.html (+ styles.css)
- design-v2/index.html (+ styles.css)
```

Open both in your browser: `open design-v1/index.html` and `open design-v2/index.html`

### 1D: Pick & Promote (5 min)

Open both in your browser. Look at them on desktop and mobile. One will feel more "you" than the other — go with your gut.

```
Copy design-v[1/2]/index.html to my-site/index.html (and its styles.css).
This is now the production version. Delete nothing — the other design
stays as a reference.
```

### 1E: Logo Generation (15 min)

```
Generate 2 SVG logo options for my brand:
- Logo 1: A mark (icon) + wordmark — minimal, modern
- Logo 2: A typographic logo — distinctive lettering, no icon

Both should work on dark and light backgrounds.
Use colors that match my final website design.

Save as my-site/logo-v1.svg and my-site/logo-v2.svg.

Also create logos-showcase.html that displays both logos on white and dark
backgrounds side by side for comparison.
```

Pick one and integrate it:

```
Use logo [1/2]. Add it to the header of my-site/index.html as an inline SVG.
Make sure the colors work with the rest of the design.
```

### 1F: Research-Informed Polish (15 min)

Your Day 1 research feeds back in here.

```
Read research/synthesis.md. Based on what my researcher found about
competitors and market positioning:

1. Is my hero headline differentiated enough from competitors?
2. Is my services section missing anything the market expects?
3. Is there a credibility signal I should add (industry stat, framework, methodology)?

Suggest specific copy changes. Reference the research findings.
Apply the changes to my-site/index.html.
```

### Step 1 Checkpoint

- [ ] Two copy variations generated in your voice
- [ ] Two design variations built and viewable
- [ ] One design picked and promoted to my-site/index.html
- [ ] Logo generated and integrated
- [ ] Research-informed polish applied
- [ ] Open `my-site/index.html` — it looks like a real site

---

_Break — 10 min_

---

## Step 2: Roast & Fix (50 min)

**What you're building:** A polished, production-quality website — tested locally, ready to deploy later.

**Day 1 artifact used:** Advisory board pattern — same multi-agent evaluation, now applied as a critique panel.

### 2A: The Expert Roast (25 min)

Yesterday you built an advisory board to evaluate a decision. Today, same pattern, different job — your advisors are now critics reviewing your website.

```
I need you to review the website at my-site/index.html by assembling a
5-person expert panel. Each expert reviews independently, then they
discuss and produce a prioritized fix list.

THE PANEL:
1. **Shreya Iyer, Brand Strategist** — Is the copy distinctive? Does it
   sound like a real person or like AI? Would she remember this site?
2. **Marcus Tan, Product Designer** — Visual hierarchy, CTAs, whitespace,
   mobile responsiveness, load time. What's broken?
3. **Ankit Verma, Growth Marketer** — 5-second test: do I understand the
   value prop? Would I convert? Where do visitors drop off?
4. **Meera Nambiar, Target Customer** — She's the exact person this site
   is for. Is she convinced? What questions does she still have?
5. **Rohit Kapoor, Angel Investor** — Positioning credibility. Does this
   look like someone worth betting on? Or is it generic?

INSTRUCTIONS:
1. Each expert writes their review independently to roast/[name]-review.md
2. After all 5, they discuss — create roast/panel-discussion.md
3. Produce roast/fix-list.md with issues ranked:
   - P0: Launch blockers (fix before deploying)
   - P1: Important (fix soon)
   - P2: Nice to have

Go. Be harsh. I'd rather fix real problems now.
```

### 2B: Apply Fixes (20 min)

```
Read roast/fix-list.md. Apply all P0 fixes to my-site/index.html.
Then apply the top 3 P1 fixes. Stop there — we're shipping.
```

Check in browser. One more pass if needed:

```
I'm looking at the site. Here's what still needs work:
[describe what you see — be specific]
Fix these. Then we deploy.
```

### Step 2 Checkpoint

- [ ] Expert roast completed — 5 reviewers, prioritized fix list
- [ ] P0 and top P1 fixes applied
- [ ] Site looks polished in your browser
- [ ] Open `my-site/index.html` on your phone (drag to phone or use local IP) — looks good

---

_Lunch — 40 min_

---

## Step 3: The Chatbot (45 min)

> **Before you start:** Your Claude session has been running for 2+ hours. Type `/compact` to summarize and free up context. This keeps Claude fast and accurate for the code-heavy steps ahead.

**What you're building:** An AI chatbot on your website that answers visitors in YOUR voice.

**Day 1 artifacts used:** CLAUDE.md (the system prompt), voice fingerprint (how it talks), "What I Offer" section (what it knows about your services)

### 3A: Set Up Your API Key (5 min)

Your chatbot needs an API key to call an LLM. We'll use **OpenRouter** — it gives you access to Claude, GPT, Gemini, and other models through a single API.

**You've been given a pre-loaded OpenRouter API key** — check the chat or the link shared by your instructor. It has credits loaded for the bootcamp.

Tell Claude:

```
Create a .env file in my-site/ directory with this key:
OPENROUTER_API_KEY=<paste your key here>
```

> **Why OpenRouter?** One API key, many models. You can start with Claude and switch to GPT or Gemini later without changing your code.

### 3B: Build the Chat Widget + API Function (25 min)

```
Add an AI chatbot to my website. Here's exactly what I need:

SETUP:
- Initialize a Node.js project in my-site/ (npm init -y)
- Install dependencies: express, dotenv, node-fetch (if needed)
- Create server.js — a local dev server that serves my website files
  and routes /api/* requests to the serverless functions in api/
- It should read .env automatically and start on port 3000

ARCHITECTURE (API key safety):
- Create api/chat.js — a serverless function (runs server-side)
- The function calls OpenRouter's API (https://openrouter.ai/api/v1/chat/completions)
- It reads OPENROUTER_API_KEY from process.env
- Use model "anthropic/claude-sonnet-4" (or any model available on OpenRouter)
- Frontend calls /api/chat — the API key NEVER appears in client-side code

SYSTEM PROMPT:
Read my CLAUDE.md and use the full content as the system prompt, with these
additions:
- "You are [my name]'s AI assistant on their website. Answer questions about
  their services, experience, and approach."
- "Speak in [my name]'s voice — use their tone, vocabulary, and style as
  described in the 'My Writing Voice' section."
- "Keep responses concise — 2-3 sentences max. Be helpful and warm."
- "If asked about pricing, reference the ranges in 'What I Offer' but
  suggest a conversation for specifics."
- "If you don't know something, say 'I'd suggest reaching out directly —
  [contact method from CLAUDE.md].'"
- "IMPORTANT: You are responding in a chat widget, not a document. Write
  in plain conversational text. No markdown — no headers, no bold, no
  bullet lists. Just talk naturally like a human in a chat."

FRONTEND:
- Clean chat widget in the bottom-right corner
- Matches my site's design (colors, fonts)
- Mobile-friendly
- Shows typing indicator while waiting
- Collapsed by default, opens on click
- Chat bubble says "Ask me anything"
- The full interaction cycle must work: open the widget → type and send
  a message → see the typing indicator while waiting → receive the
  response with the input ready for the next message → close the widget
  → reopen it and send another message. Every step must work every time.

Save the updated files. Keep the same my-site/ directory structure.

After creating all files, install dependencies and start the server.
```

Claude will run `npm install` and `node server.js` for you. Once you see "Server running on http://localhost:3000" in the terminal, move on.

> **What's server.js?** A tiny local server that serves your website and routes `/api/*` requests to your serverless functions. It reads your `.env` file automatically. When you deploy to Vercel later, Vercel does the same thing — but for now, your laptop is the server.

### 3C: Test the Chatbot Locally (10 min)

Open **http://localhost:3000**. Click the chat bubble. Test these:

1. "What do you do?" — should describe your services from CLAUDE.md
2. "How can you help someone like me?" — should be specific, not generic
3. "What's your approach?" — should reflect your style
4. "How much do you charge?" — should reference your pricing range

**Does the widget work?** Test the basics: click the bubble to open, send a message, verify the input re-enables after the response, click X to close, click the bubble again to reopen. If the panel won't close, the input stays frozen, or the typing dots won't stop — tell Claude what you see and ask it to fix the chat widget.

**Does it sound like you?** If it's too formal, too vague, or missing context:

```
The chatbot response was [too formal / too generic / missing info about X].
Update the system prompt in api/chat.js to fix this.
```

### 3D: Voice Check (5 min)

The real test — does it pass the "would I actually say this?" check?

```
Read the system prompt in api/chat.js. Compare it against my CLAUDE.md
voice section. Is anything missing that would make the chatbot sound more
like me? Suggest specific additions to the system prompt.
```

Ask a friend or neighbor to chat with your bot at `http://localhost:3000`. Do they think it sounds like a real person?

### Step 3 Checkpoint

- [ ] Chat widget visible at http://localhost:3000
- [ ] API function handles calls (key is safe — server-side only)
- [ ] Chatbot answers questions about your services using CLAUDE.md
- [ ] Chatbot speaks in your voice — not generic AI
- [ ] Tested on mobile (use your local IP, e.g. `http://192.168.x.x:3000`)

---

## Step 4: The Proposal Engine (75 min)

> **Back from lunch?** Run `/compact` again. The proposal engine is the most complex step — Claude needs a clean context window to generate and customize the code correctly.

**What you're building:** The chatbot gains a second mode — it gathers requirements, generates a personalized proposal PDF, emails it to the visitor, scores the lead, and alerts you.

**Day 1 artifacts used:** Voice fingerprint (proposal voice), "What I Offer" (proposal scoping), Chief of Staff triage rules (lead scoring), Telegram bot (owner alerts)

### 4A: Add Intake Mode to the Chatbot (20 min)

```
Upgrade the chatbot in api/chat.js to support two modes:

MODE 1 — Q&A (existing):
Same as before. Answers questions about my services in my voice.

MODE 2 — INTAKE (new):
When a visitor expresses interest or need ("I need help with...",
"Can you help me...", "I'm looking for..."), the chatbot transitions
to intake mode and gathers requirements conversationally:

1. What does your company do? (industry, size, stage)
2. What's the challenge you're facing?
3. What have you tried so far?
4. What would success look like?
5. What's your budget range?
6. What's your email? (asked last)

The chatbot should:
- Ask ONE question at a time, conversationally (not a form)
- Acknowledge each answer naturally before asking the next
- Use my voice throughout
- After getting the email, say: "Perfect — I'll put together a proposal
  tailored to your situation. You'll have it in your inbox shortly."

The conversation history must be maintained across messages (pass full
history on each API call). When intake completes, the frontend should
POST the full conversation + structured data to /api/generate-proposal.

Update both api/chat.js and the frontend chat widget.
```

Test the intake flow: open the chat, say "I need help with my marketing strategy" and walk through the questions.

### 4B: Build the Agentic Proposal Engine (25 min)

This is where your chatbot becomes an **agent**. Instead of hardcoding every step ("first do this, then do that"), you give Claude a set of **tools** and let it decide the flow.

Think about it: in Steps 1-3, you told Claude what to write. Now you're telling Claude what it can **do** — and letting it figure out the rest.

**The pattern:**

- You define tools (render PDF, send email, store lead, alert owner)
- Claude receives the visitor's intake data + the tools
- Claude decides: "I'll write the proposal, render a PDF, score this lead, email it, store it, and alert Priya"
- Your code just executes whatever Claude asks for
- This is the same pattern behind Claude Code itself — Claude gets tools, decides what to do, and acts

**We've pre-built the engine for you.** The agentic proposal engine has a lot of moving parts — PDF rendering, email APIs, Telegram alerts, Supabase storage, an agent loop. Rather than risk a broken build, we're giving you a tested reference implementation. Your job is to make it yours.

**Step 1: Copy the reference files**

```bash
# Install the PDF library
cd my-site && npm install pdf-lib

# Copy the pre-built proposal engine and Vercel config
cp ../reference/api/generate-proposal.js api/generate-proposal.js
cp ../reference/vercel.json vercel.json
```

**Step 2: Read and understand what it does**

```
Read api/generate-proposal.js. Explain to me in plain language:
1. What are the 4 tools Claude can use?
2. How does the agent loop work?
3. Where does the system prompt come from?
4. What does sanitizeForPdf do and why is it needed?
```

Take a minute to understand the architecture. This is the same pattern behind Claude Code itself — an LLM with tools, running in a loop until the job is done.

**Step 3: Customize it with YOUR identity**

The file has `[CUSTOMIZE]` markers where your data needs to go. Tell Claude:

```
Read api/generate-proposal.js and my CLAUDE.md. The file has [CUSTOMIZE]
markers. Replace them:

1. The AGENT_SYSTEM_PROMPT — replace the placeholder with my real identity,
   voice, services, pricing, and lead triage rules from my CLAUDE.md
2. The PDF cover page — my real name and tagline
3. The PDF footer — my real contact info
4. The PDF brand colors — match my website's color scheme
5. The email sender name — use my name (keep onboarding@resend.dev as the
   email address — that's a Resend free tier requirement)

Keep everything else exactly as it is — the tools, the agent loop, the
sanitizeForPdf function. Only change the [CUSTOMIZE] parts.
```

> **What is this file?** It's an AI agent. The chatbot (Step 3) gathers information. This agent takes action: it writes a proposal in your voice, renders a branded PDF, emails it to the visitor, scores the lead, stores it in Supabase, and alerts you on Telegram. Claude decides the order. Claude writes the content. Your code just gives it tools and gets out of the way. That's the difference between a script and an agent.

### 4C: Set Up External Services (15 min)

Three services need API keys. Add them all to your `.env` file in `my-site/`.

**Resend (email sending):**

1. Go to [resend.com](https://resend.com) → sign up → create API key
2. On the free tier, use the default `onboarding@resend.dev` sender (can send to your own email)
3. Add to your `.env` file: `RESEND_API_KEY=re_your_key_here`

**Supabase (lead storage + CRM — free tier):**

1. Go to [supabase.com](https://supabase.com) → sign up → **New Project**
   - Organization: create one (or use existing)
   - Project name: `my-site-leads` (or whatever you like)
   - Database password: set one (you won't need it directly — save it anyway)
   - Region: pick the closest to you
   - Plan: **Free** (plenty for this)

2. Get your **API URL**:
   - Go to **Project Settings** (gear icon, left sidebar) → **Data API**
   - Copy the **API URL** at the top (under "RESTful endpoint for querying and managing your database") — it looks like `https://abcdefg.supabase.co`

3. Get your **API key**:
   - Go to **Project Settings** → **API Keys**
   - Copy the **Publishable key** — it starts with `sb_publishable_...`
   - (Ignore the Secret key — you don't need it for this)

4. Create the leads table:
   - Go to **SQL Editor** (left sidebar, looks like a terminal icon)
   - Click **New Query** and paste this:

```sql
CREATE TABLE leads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT,
  company TEXT,
  email TEXT,
  industry TEXT,
  challenge TEXT,
  budget TEXT,
  score TEXT,
  conversation_transcript TEXT,
  status TEXT DEFAULT 'proposal_sent',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow inserts from the publishable key (your serverless function)
CREATE POLICY "Allow anonymous inserts" ON leads
  FOR INSERT WITH CHECK (true);

-- Allow reads from the publishable key (for your dashboard later)
CREATE POLICY "Allow anonymous reads" ON leads
  FOR SELECT USING (true);
```

   - Click **Run** (or Cmd+Enter). You should see "Success. No rows returned" — that means it worked.

5. Add to your `.env` file:
   - `SUPABASE_URL=https://your-project.supabase.co`
   - `SUPABASE_KEY=sb_publishable_your-key-here`

6. **Verify:** Go to **Table Editor** (left sidebar) → you should see a **leads** table. It'll be empty — that's correct. After the first proposal is sent, leads will appear here with their scores.

**Telegram alerts (reuse Day 1 bot):**

- You already have `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` from yesterday
- Add both to your `.env` file

Your `.env` file should now have all 6 keys:

```
OPENROUTER_API_KEY=...
RESEND_API_KEY=...
SUPABASE_URL=...
SUPABASE_KEY=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

> **All services are free tier.** Resend free tier handles 100 emails/day. Supabase free tier gives 500 MB database + 1 GB file storage. More than enough for your AI sales agent.

### 4D: Test Everything Locally (15 min)

First, verify all services are connected before testing end-to-end:

```
Run a quick health check on all external services:
1. Test that OPENROUTER_API_KEY works (make a simple API call)
2. Test that RESEND_API_KEY is valid (check the API responds)
3. Test that SUPABASE_URL + SUPABASE_KEY can reach the leads table
4. Test that TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID can send a message

Report which services are working and which need fixing.
```

Fix anything that's broken before proceeding. Common issues:
- Supabase: "table not found" → go back to 4C and run the CREATE TABLE SQL
- Resend: works but can only send to your own email on the free tier
- Telegram: "chat not found" → make sure you messaged your bot first (from Day 1)

Now restart the server so it picks up the new API keys:

```
Restart the server (stop the old one and run node server.js again)
```

Now test the full agent loop at **http://localhost:3000**:

1. Click the chat bubble
2. Say: "I need help with my GTM strategy"
3. Answer the intake questions naturally
4. Provide your email address (use the email you signed up with on Resend — free tier only sends to your own email)
5. Wait 30 seconds

**Four things should happen:**

- The chatbot says "You'll have it in your inbox shortly"
- An email arrives with a **personalized proposal PDF** attached
- Your phone buzzes with a Telegram alert — lead summary + the proposal PDF
- The lead appears in your Supabase Table Editor with a score (HIGH/MEDIUM/LOW)

Check the terminal running `node server.js` — you'll see the agent working:

```
Agent turn 1... Claude called 1 tool: render_proposal_pdf
Agent turn 2... Claude called 3 tools: send_email, store_lead, alert_owner
Agent turn 3... Agent completed.
Agent pipeline complete: { proposal: true, email: true, stored: true, alerted: true }
```

**If something breaks:**

- Check the terminal for error messages — they'll tell you exactly which step failed
- Missing env var → check your `.env` file
- Email not arriving → check Resend dashboard; free tier only sends to your own email
- Supabase error → check that the leads table exists (SQL Editor → run the CREATE TABLE again if needed)
- Telegram not working → verify your bot token and chat ID from Day 1
- PDF generation error mentioning "cannot encode" → the AI-generated proposal has special characters (like ₹) that pdf-lib's standard fonts can't render. Tell Claude: "The PDF crashed on a special character. Add text sanitization to handle non-ASCII characters before rendering."

### Step 4 Checkpoint

- [ ] Chatbot transitions to intake mode when visitor expresses need
- [ ] Intake gathers requirements conversationally (not a form)
- [ ] **Agent loop works** — Claude decides the flow, calls tools autonomously
- [ ] Proposal PDF generated — branded, personalized, in your voice
- [ ] Email sent to visitor with PDF attachment
- [ ] Lead scored by Claude and stored in Supabase
- [ ] Telegram alert sent to owner — with the proposal PDF attached
- [ ] **End-to-end test works** — chat → intake → agent → PDF → email → alert

---

_Break — 10 min_

---

## Step 5: Deploy & Demo (60 min)

**What you're doing:** Everything works locally. Now put it on the internet — live URL, real visitors, real agent running 24/7.

### 5A: Push to GitHub (5 min)

```bash
cd my-site
git init
```

Create a `.gitignore` that excludes sensitive and generated files:

```
Tell Claude: Create a .gitignore that excludes node_modules, .env, and .vercel
```

Then push to GitHub:

```bash
gh repo create my-site --public --source=. --push
```

> **IMPORTANT:** The `.gitignore` must exclude `.env` — your API keys should never be in GitHub. Vercel gets them separately.

### 5B: Deploy to Vercel (10 min)

1. Go to [vercel.com](https://vercel.com) and sign in (use "Continue with GitHub")
2. Click **"Add New Project"**
3. Find your `my-site` repo in the list and click **Import**
4. Framework Preset: select **"Other"**
5. Click **Deploy**

You'll get a URL like `https://my-site.vercel.app`.

Now add your environment variables. Go to your project → **Settings** → **Environment Variables** and add all 6:

- `OPENROUTER_API_KEY`
- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

After adding the env vars, **redeploy**: go to **Deployments** → click the three dots on the latest deploy → **Redeploy**.

> **Not working?** Make sure `index.html` is in the root of the repo (not in a subfolder). If the page is blank, check the Vercel build logs for errors.

### 5C: The Live Demo (15 min)

**Open your live URL on your phone.** That's your site. Real URL. Real internet. The agent is running.

Now the moment. Ask a neighbor (or use a second device) to be your "visitor."

1. **Visitor** lands on your live site, browses
2. **Visitor** opens chat: "I'm looking for help with [something relevant to your services]"
3. **Chatbot** (in your voice) gathers requirements over 3-5 messages
4. **Visitor** provides their email
5. **Behind the scenes** — the agent loop kicks in: Claude writes the proposal, renders a PDF, scores the lead, sends the email, stores everything, and alerts you
6. **Visitor's inbox** — personalized proposal PDF arrives
7. **Your phone buzzes** — Telegram shows the lead summary + the proposal PDF

**That's an agent.** It perceived a visitor, decided they were qualified, generated a personalized proposal, rendered a branded PDF, emailed it, scored the lead, stored it in your CRM, and alerted you — all in about 25 seconds, without you opening a laptop.

### 5D: Understand What You Built (5 min)

**The chatbot** (Step 3) is a conversation tool. It answers questions. It gathers information. But it doesn't *do* anything.

**The agent** (Step 4) is different. It receives the conversation, then *acts autonomously*:

- It decides the lead is worth a proposal
- It writes a personalized proposal in your voice
- It renders a branded PDF
- It writes a personalized email and sends it
- It scores the lead using your triage rules
- It alerts you on Telegram — with the proposal attached

You didn't write "step 1, step 2, step 3." You gave Claude tools and a goal. Claude figured out the steps. That's the difference between a script and an agent.

> **The teaching moment:** "You don't give an intern full send authority on day one. You review their work, give feedback, and gradually let them operate independently. Same with AI agents. Today it sends immediately. Next week, you add approval mode — the agent generates the proposal, sends it to your phone for review, and waits for your 'approve' before sending. Start autonomous, build trust, then add guardrails where you need them."

Now every `git push` automatically updates your live site. The agent runs 24/7 without you touching anything.

---

## Show & Tell (4:35 – 4:55)

**3 minutes per person.** Share your screen. Show the live URL. This is a demo, not a lecture.

### The Format

**1. Who I am (15 sec)** — Name, role, one line.

**2. What I built — show the live URL (1 min)** — Pull up your Vercel URL. Walk through the site. Click the chat widget. If the agent pipeline works, trigger it — show the proposal PDF arriving, your phone buzzing.

**3. The compound — how Day 1 fed Day 2 (45 sec)** — Pick ONE example: voice fingerprint → chatbot voice, research → site positioning, triage rules → lead scoring, advisory board → roast panel.

**4. Where I got stuck (30 sec)** — What broke? What fixed it?

**5. What I'm doing Monday (15 sec)** — One specific thing. "I'm sending this URL to 3 prospects" or "I'm running /brief every morning."

> **For Zoom:** Instructor will call on people. Have your live URL ready in a browser tab. If you're not called, drop your URL in the chat — everyone should see what you shipped.

---

## What You Built This Weekend

### Day 1 → Day 2: The Compound

| Day 1                       | →   | Day 2                                                            |
| --------------------------- | --- | ---------------------------------------------------------------- |
| CLAUDE.md                   | →   | Chatbot system prompt — answers like you                         |
| Voice fingerprint           | →   | Proposals and emails written in your voice                       |
| Researcher team             | →   | Competitive positioning on your site                             |
| Advisory board              | →   | Expert roast panel that refined your site                        |
| Chief of Staff triage rules | →   | Claude scores leads using YOUR rules (no regex — real reasoning) |
| Telegram bot                | →   | Owner alerts — phone buzzes with lead summary + proposal PDF     |
| Comms Lead skill            | →   | Website copy written in your voice                               |

Without Day 1, today would have produced a generic website with a chatbox.

With Day 1, today produced a **personal sales agent that speaks in your voice, qualifies leads, writes proposals, renders branded PDFs, emails them, and alerts you on your phone — running 24/7 on the internet.**

### Your Deliverables

- [ ] **Published website** — live URL on Vercel
- [ ] **AI chatbot** — answers in your voice, knows your services
- [ ] **AI agent** — Claude with tools, orchestrating autonomously
- [ ] **Branded proposal PDFs** — generated per visitor using pdf-lib
- [ ] **Email automation** — proposals emailed with PDF attachments
- [ ] **Lead scoring** — Claude applies your triage rules (HIGH/MEDIUM/LOW)
- [ ] **CRM storage** — leads stored in Supabase with scores
- [ ] **Owner alerts** — Telegram notifications with proposal PDF attached

### Key Deliverables Achieved

| #   | Deliverable                       | Where                                                 |
| --- | --------------------------------- | ----------------------------------------------------- |
| 1   | Competitive research & analysis   | Day 1 Step 3 + website positioning                    |
| 2   | Data analysis & Report generation | Day 1 Step 5 + lead scoring                           |
| 3   | RFP / Contracts / Artifacts       | Proposal PDFs — personalized per client               |
| 4   | Email Triage                      | Day 1 Chief of Staff + Day 2 lead alerts              |
| 5   | Published agent                   | Chatbot + proposal engine + alerts                    |
| 6   | Content creation                  | Website copy + proposals + emails — all in your voice |
| 7   | Published website                 | Live URL on Vercel                                    |
| 8   | Creating Amazing decks            | Branded proposal PDFs — different for every client    |

---

## The Monday Morning Habit

You now have two systems that work every day:

**Morning (Day 1 system):**

```
/brief
```

Your Chief of Staff reads your email, applies your triage rules, and delivers a morning briefing to your phone.

**All day (Day 2 system):**
Your website is live. Visitors arrive. The chatbot engages them. When someone's serious, it gathers their requirements and generates a personalized proposal. Your phone buzzes. You review. You approve. The proposal lands in their inbox. You didn't open a laptop.

**The loop:**

```
Day 1 system: Email comes IN → Claude triages it for you
Day 2 system: Email goes OUT → Claude sells for you
```

---

## Take-Home Stretch Goals

Things you can add after the bootcamp:

- **Automated follow-ups:** Vercel Cron Job (free: 2/day) checks Supabase for leads >48hrs with no response, auto-sends personalized follow-up
- **Calendar booking:** Add a Cal.com link in proposals for high-value leads
- **Lead dashboard:** Build a /admin page reading from Supabase
- **Full autonomy:** Set `APPROVAL_MODE=false` once you trust the proposals
- **Custom domain:** Point your own domain to the Vercel deployment
- **Multiple proposal templates:** Different formats for different service lines

---

## Key Takeaway

> Yesterday, Claude learned who you are, how you write, what your world looks like. Today, Claude used all of that to build your public face and sell for you while you sleep. One weekend. Two deployed products. An AI team that works when you don't. The question isn't whether this works — you just proved it does. The question is: what do you build next?

---

## Annexure

### Deploying via Vercel CLI

During the bootcamp we deployed via the Vercel dashboard (GitHub import). For quick iterations after the bootcamp, you can deploy directly from your terminal:

```bash
# Install Vercel CLI (one time)
npm i -g vercel

# Deploy from your project directory
cd my-site
vercel

# Deploy to production (after testing)
vercel --prod
```

The CLI is useful when you want to preview a change before pushing to GitHub, or when you want to set environment variables:

```bash
# Add environment variables (used in Steps 3-4)
vercel env add OPENROUTER_API_KEY
vercel env add RESEND_API_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID
```

> **Tip:** Dashboard deploys (via GitHub push) and CLI deploys both work. Use GitHub push for production changes, CLI for quick previews.
