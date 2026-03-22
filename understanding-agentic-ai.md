# From Manual Work to Agentic AI: Understanding the Spectrum

**For:** Anyone who wants to understand what "agentic AI" actually means — and how it's different from automation, programming, and regular AI tools | **Read time:** 15 minutes

---

## Why This Matters

People throw around terms like "automation," "AI," and "agentic" as if they mean the same thing. They don't. Each represents a fundamentally different relationship between you and the machine — who decides what to do, who does the work, and who handles surprises.

By the end of this document, you'll be able to hear someone say "we're building an agentic workflow" and know exactly what they mean — and what they don't.

---

## The Five Levels

Imagine you run a 50-person SaaS company. Every Monday, you need a report on last week's sales numbers sent to your leadership team. Here's how each level handles it:

---

### Level 1: Manual

**You do everything. The computer is a tool you operate.**

You open a spreadsheet. You pull numbers from the CRM by clicking through dashboards. You copy them into a slide deck. You write a summary. You attach it to an email. You hit send.

Every step requires your hands, your eyes, your judgment. If something looks off, you investigate. If the format changes, you adjust. The computer does what you tell it, when you tell it, exactly as you tell it.

**Everyday example:** Cooking dinner by reading a recipe step by step. You chop, you stir, you taste, you adjust.

**Characteristics:**
- You make every decision
- You do every action
- Flexible but slow
- Doesn't scale — 2x the reports means 2x your time

---

### Level 2: Workflow Automation

**You set up rules. The computer follows them — the same way, every time.**

You connect your CRM to Google Sheets using Zapier. Every Friday at 6 PM, a Zap pulls last week's numbers into a sheet. Another Zap formats it and emails it to the leadership team.

You set it up once. It runs forever — as long as nothing changes. But if the CRM adds a new field, or a stakeholder wants a different metric, or the numbers look wrong one week — the automation doesn't notice. It just keeps doing what you told it to do.

**Everyday example:** Setting a recurring bank transfer for rent. It sends ₹45,000 on the 1st of every month. If rent increases, it still sends ₹45,000 until you update it.

**Tools you'd recognise:** Zapier, Make, Power Automate, Google Apps Script, IFTTT, Excel macros, email filters

**Characteristics:**
- You design the workflow once
- The computer executes it identically every time
- No judgment — follows rules, can't handle exceptions
- Breaks silently when the world changes
- Great for repetitive, predictable tasks

---

### Level 3: Traditional Programming

**You write logic that handles different situations. The computer follows your instructions, including your "what if" plans.**

A developer writes a Python script that:
1. Connects to the CRM's API
2. Pulls last week's deals, grouped by region
3. Calculates win rate, average deal size, and pipeline velocity
4. Flags any region where win rate dropped more than 10%
5. Generates a formatted HTML email with a table and highlights
6. Sends it to different distribution lists based on the numbers

Unlike automation, the script has *logic*. It can handle variations — different numbers produce different outputs. If win rate drops, the email says so. If a region has no data, it handles that gracefully instead of crashing.

But every scenario it handles, a programmer had to anticipate. If a completely new situation arises — say, the CRM changes its API format — the script breaks until someone fixes it.

**Everyday example:** A GPS navigation app. It recalculates routes when you miss a turn (logic!), but it can't decide whether you should stop for fuel or grab lunch — it only handles what it was programmed to handle.

**Tools you'd recognise:** Python scripts, SQL queries, internal dashboards, mobile apps, websites — all software

**Characteristics:**
- A programmer anticipates scenarios and writes logic for each
- Handles variation within designed boundaries
- Can process massive scale (millions of records)
- Breaks when it encounters something no one planned for
- Requires a programmer to build and maintain

---

### Level 4: AI-Assisted (Copilot Mode)

**You're in charge. AI helps when you ask. You decide what to do with its output.**

You open Claude and say: "Here are last week's sales numbers. Write a summary for my leadership team highlighting the three most important trends."

Claude reads the data, identifies patterns, and writes a summary in natural language — something no automation or script could do. It might notice that enterprise deals are taking 20% longer to close this quarter, or that a new competitor is appearing in loss reasons.

But you're still driving. You asked the question. You decided what data to share. You'll review the summary before sending it. If Claude misses something or gets the tone wrong, you fix it. Claude is your assistant — capable, but not autonomous.

**Everyday example:** Asking a knowledgeable friend for restaurant recommendations. They suggest three places and explain why. But you pick the one, you make the reservation, you go.

**Tools you'd recognise:** ChatGPT, Claude.ai, GitHub Copilot, Notion AI, Grammarly — anything where you prompt and it responds

**Characteristics:**
- You initiate every interaction
- AI generates, you evaluate and decide
- Can handle ambiguity and nuance (unlike rules or code)
- Limited to one task at a time — what you asked for
- You're the bottleneck — it waits for you between steps
- No memory between sessions unless you set it up

---

### Level 5: Agentic AI

**You define the goal. The AI figures out the steps, uses tools, handles problems, and delivers the result.**

You say: "Every Monday morning, review last week's sales data from our CRM, compare it against our quarterly targets, identify the three most important trends, write a leadership summary in my voice, and email it to the exec team. If any region's win rate dropped more than 10%, also ping the regional head on Slack with a heads-up."

The agent:
1. Connects to the CRM and pulls the data (tool use)
2. Analyses trends and compares against targets (reasoning)
3. Decides which three trends matter most (judgment)
4. Writes the summary in your established tone (context)
5. Sends the email (action)
6. Checks if any region's win rate dropped — and if so, writes a Slack message to the right person (conditional action)
7. If the CRM API is down, it retries, then tries an alternative data source, then tells you it couldn't complete the task (error handling)

No one programmed each step. The agent broke down the goal into steps, chose which tools to use, and handled exceptions on its own. You defined *what* you wanted. The agent figured out *how*.

**This is what you experienced in Build 5** when you told Claude to "assemble a panel of 5 experts and simulate a discussion between them." You didn't script the discussion. You didn't tell Claude what each expert should say. You defined the goal and the constraints — Claude orchestrated the rest.

**Everyday example:** Hiring a new operations manager. You tell a trusted recruiter: "Find me someone with 8+ years in logistics, who's managed teams of 20+, preferably from a Series B or later startup. Screen them and send me the top 3." The recruiter decides where to post, how to screen, what questions to ask, and who makes the cut. You get three candidates and a recommendation.

**Tools you'd recognise:** Claude Code with tools, AutoGPT, multi-agent systems, AI assistants with MCP (Model Context Protocol), LangChain agents

**Characteristics:**
- You set the goal and constraints
- The AI plans, executes, and adapts
- Uses tools (APIs, file systems, browsers, databases)
- Handles errors and unexpected situations
- Can coordinate multiple sub-tasks (parallel agents)
- Can loop — review its own output and improve it
- You review the final result, not every step

---

## The Spectrum at a Glance

| | Manual | Automation | Programming | AI-Assisted | Agentic AI |
|---|---|---|---|---|---|
| **Who decides what to do?** | You | You (once) | Programmer (once) | You (each time) | You set the goal |
| **Who does the work?** | You | The machine | The machine | You + AI together | The AI |
| **Handles surprises?** | Yes (you adapt) | No (breaks) | Only planned ones | Yes (if you ask) | Yes (autonomously) |
| **Needs a programmer?** | No | Sometimes | Yes | No | No |
| **Scales?** | Poorly | Well for simple tasks | Well | Moderate | Well |
| **Example tool** | Excel, email | Zapier, macros | Python, SQL | ChatGPT, Claude.ai | Claude Code, agents |

---

## The Key Distinction: Agentic vs. Everything Else

The word "agentic" means one specific thing: **the AI decides how to accomplish your goal, not just executes your instructions.**

- An automation does what you configured → not agentic
- A script does what a programmer wrote → not agentic
- ChatGPT answering your question → not agentic (it responded, it didn't *act*)
- Claude Code reading your files, planning an approach, running commands, and fixing errors it encounters → **agentic**

The test: **Did the AI take multiple steps, use tools, and make decisions without you telling it each step?** If yes, it's agentic.

---

## Guess the Level: 12 Scenarios

Read each scenario. Decide which level it is: **Manual, Automation, Programming, AI-Assisted, or Agentic AI.** Discuss with the people around you before checking the answer.

---

**Scenario 1:**
Every morning, Kavitha opens Zoho CRM, filters deals closing this week, and manually types a summary in her team's WhatsApp group.

<details><summary>Answer</summary>

**Manual.** Kavitha does every step herself. The computer is just where the data lives.

</details>

---

**Scenario 2:**
Rahul set up a Zapier workflow: when a form response comes in on Typeform, it creates a row in Google Sheets and sends a Slack notification to the sales channel.

<details><summary>Answer</summary>

**Automation.** Rules defined once, executes identically every time. If the Slack channel name changes, it breaks silently.

</details>

---

**Scenario 3:**
A developer built a dashboard that pulls data from the company's database every hour, calculates conversion rates by channel, and shows a real-time graph. If any channel drops below 2% conversion, it sends an alert.

<details><summary>Answer</summary>

**Programming.** A developer wrote logic to handle specific scenarios (the threshold, the calculation, the alert). It handles variation within designed boundaries but can't handle anything the developer didn't anticipate.

</details>

---

**Scenario 4:**
Meera pastes her quarterly business review into Claude and says: "Rewrite the executive summary to be half the length and more direct. Focus on what the board cares about."

<details><summary>Answer</summary>

**AI-Assisted.** Meera chose what to share, asked a specific question, and will review the output before using it. Claude helped but didn't act independently.

</details>

---

**Scenario 5:**
Arjun tells Claude Code: "Read all 23 files in my work-notes folder, figure out what projects I'm working on, identify anything that's overdue or at risk, and create a prioritised action list for this week. Save it as weekly-priorities.md."

<details><summary>Answer</summary>

**Agentic AI.** Arjun defined the goal. Claude decided how to approach it — which files to read, how to identify projects, what "at risk" means in context, how to prioritise. It used tools (file reading, writing) and made judgment calls.

</details>

---

**Scenario 6:**
An email rule in Outlook automatically moves any email with "invoice" in the subject line to the "Finance" folder.

<details><summary>Answer</summary>

**Automation.** A simple rule executing the same action every time. If someone sends an invoice with "payment receipt" in the subject, it won't catch it.

</details>

---

**Scenario 7:**
Priya records a voice memo after a client meeting. She uploads it to Otter.ai, which transcribes it. She then copies the transcript into Claude and asks: "Extract the action items and format them as a checklist."

<details><summary>Answer</summary>

**AI-Assisted.** Priya is driving every step — recording, uploading, copying, prompting. Claude helps with one specific task (extraction) when asked.

</details>

---

**Scenario 8:**
A finance team uses a Python script that runs every month-end. It pulls transactions from the ERP, categorises them by cost centre, checks for anomalies (any expense over ₹5 lakhs without approval), generates a PDF report, and emails it to the CFO.

<details><summary>Answer</summary>

**Programming.** Sophisticated logic, but every scenario was anticipated by the developer. It won't notice a new type of anomaly that wasn't coded for.

</details>

---

**Scenario 9:**
Deepak tells Claude Code: "I have a landing page at output/html/final-v1.html. Assemble a panel of 5 experts — a copywriter, a designer, a growth marketer, a target customer, and an investor. Have them critique the page, debate the major issues, and give me a prioritised fix list."

<details><summary>Answer</summary>

**Agentic AI.** Deepak set the goal and constraints (5 specific experts, debate format, prioritised output). Claude planned the discussion, decided what each expert would focus on, generated the debate, and synthesised the findings — all without step-by-step instructions.

</details>

---

**Scenario 10:**
A mobile banking app sends you a notification: "You spent ₹12,400 on dining this month — 40% more than last month."

<details><summary>Answer</summary>

**Programming.** A developer wrote code to compare monthly category spending and trigger a notification at a threshold. Smart, but rule-based.

</details>

---

**Scenario 11:**
Nisha asks ChatGPT: "What's the difference between a term sheet and a shareholders' agreement?" She reads the answer and takes notes.

<details><summary>Answer</summary>

**AI-Assisted.** This is a Q&A interaction. Nisha asked, the AI answered. No tools used, no multi-step execution, no autonomous action.

</details>

---

**Scenario 12:**
Vikram tells Claude Code: "Look at the 5 competitor landing pages in my references folder. Analyse what each one does well and poorly. Then take my landing page at index.html and rewrite the hero section, pricing section, and CTA to be more competitive. Generate 2 versions and explain your choices."

<details><summary>Answer</summary>

**Agentic AI.** Vikram set the goal. Claude independently: read multiple files, analysed competitors, identified strengths and weaknesses, applied those insights to rewrite specific sections, generated multiple variations, and explained its reasoning. Multiple tools, multiple steps, autonomous judgment throughout.

</details>

---

## Instructor Notes: Running This as a Live Activity

**Time needed:** 15–20 minutes

**Setup:**
- Display each scenario on screen one at a time (or read it aloud)
- Don't show the 5-level table yet — reveal it after scenario 3 so people build intuition before getting the framework

**How to run it:**

1. **Scenarios 1–3:** Read each one. Ask the room: "Is this the same thing or different? How?" Let them debate. After scenario 3, reveal the first three levels (Manual → Automation → Programming) and let them name what's different.

2. **Scenarios 4–5:** Read both. Ask: "Both use AI. What's different?" This is where the AI-Assisted vs. Agentic distinction should emerge from the room. Reveal the full 5-level table.

3. **Scenarios 6–12:** Now it's a quiz. Read each one, give the room 30 seconds to discuss with their neighbour, then ask for a show of hands for each level. Reveal the answer.

**Key moments to narrate:**

- After Scenario 5 vs 4: *"Notice — Meera told Claude exactly what to do. Arjun told Claude what he wanted. That's the difference. One is assisted. The other is agentic."*

- After Scenario 9: *"This is exactly what you're about to do in Build 5. You won't script the expert discussion. You'll set up the panel and the goal — Claude orchestrates the rest."*

- After Scenario 12: *"Count the steps Claude took. Read files, analyse, compare, apply insights, generate variations, explain. Vikram gave ONE prompt. That's what agentic means — you define the destination, the AI plans the route."*

**Common debate points (let them happen):**

- "Isn't Scenario 8 also AI?" → No. Sophisticated ≠ intelligent. The finance script follows coded rules. It can't handle a situation the developer didn't plan for.
- "Isn't all of Claude agentic?" → No. When you ask Claude a question and it answers, that's assisted. Agentic requires tool use, multi-step execution, and autonomous decision-making.
- "Where does the line between Automation and Programming sit?" → Automation is configuration (drag-and-drop, if-this-then-that). Programming is logic (loops, conditions, error handling). Automation is what you build without writing code. Programming is what a developer builds.

---

## One More Thing: Why "Agentic" Matters for You

You don't need to build agents. You need to know when you're using one — because it changes how you work:

| When using AI-Assisted tools | When using Agentic AI |
|---|---|
| You break the task into steps | You describe the end goal |
| You prompt for each step | You prompt once |
| You copy-paste between tools | The agent uses tools directly |
| You review after each step | You review the final output |
| Your time = number of steps | Your time = describing the goal well |

The shift is not "AI does more." The shift is **you operate at a higher level.** Instead of managing steps, you manage outcomes.

That's what this bootcamp is building towards.
