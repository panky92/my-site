# Environment Variables: A Practical Guide

**For:** Non-engineers who ship things from the terminal | **Prerequisite:** You're comfortable with the terminal and Claude Code

---

## What Is an Environment Variable?

Think of it as a **sticky note on your computer** that only your programs can read.

When you deploy a website that talks to a database, your code needs credentials — a URL, a key, a password. You could paste these directly into your code. But then anyone who sees your code sees your passwords. That's bad.

Instead, you store them as environment variables — outside your code, on the machine that runs it. Your code says "read the sticky note called `DATABASE_URL`" and the machine hands it over.

**The rule is simple:** Code is public. Secrets are not. Environment variables keep them separate.

---

## Why Can't I Just Paste the Key in My Code?

You can. It will work. And then one of these things will happen:

**1. You push to GitHub and the world sees it.**
Earlier in this session, you pushed code to a public GitHub repository. If your Supabase key was sitting in that HTML file, it's now visible to anyone — including bots that scan GitHub every few minutes looking for exactly this.

**2. You share your code and accidentally share your wallet.**
Sending your project folder to a friend? Showing your screen in a meeting? Pasting code in a Slack thread? If the key is in the code, it travels with it. An API key is like a credit card number — whoever has it can use it and you get the bill.

**3. You need to change the key and now you're hunting through files.**
Keys expire. Keys get rotated. If you hardcoded `sk-or-v1-abc123` in 4 different files, you need to find and update all 4. With a `.env` file, you change it in one place.

**4. Your local setup and production setup need different keys.**
Your laptop talks to a test database. Your live website talks to the real one. Same code, different keys. Environment variables let you swap them without changing a single line of code.

**The bottom line:** Pasting a key in your code works the way writing your ATM PIN on your debit card works. Convenient until it isn't.

---

## Your First Environment Variable

Open your terminal and try this:

```bash
export MY_NAME="Priya"
echo $MY_NAME
```

You just created an environment variable called `MY_NAME` and read it back. That's all it is — a named value stored in your terminal session.

This one disappears when you close the terminal. That's fine for now. For real projects, you'll use `.env` files (next section).

---

## The `.env` File

A `.env` file is a plain text file that holds your environment variables. One per line.

```
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VERCEL_TOKEN=vcel_abc123def456
```

**How to create one:**

```bash
touch .env
```

Then open it in any editor and add your variables. No spaces around the `=`. No quotes needed (unless the value has spaces).

**How your code reads it:** Most frameworks and tools automatically load `.env` files. Claude Code can read them too. When you run a project locally, the values in `.env` are available to your code as if you'd typed `export` for each one.

---

## The Golden Rule: Never Commit Your `.env` File

Your `.env` file contains secrets. Your GitHub repository is (often) public. If you push your `.env` to GitHub, anyone on the internet can see your keys.

**The fix:** Add `.env` to your `.gitignore` file.

```bash
echo ".env" >> .gitignore
```

This tells git to pretend the file doesn't exist. It won't be tracked, committed, or pushed.

**Check yourself before you push:**

```bash
git status
```

If you see `.env` in the list of files to be committed, stop. Add it to `.gitignore` first.

> **Claude Code helps here.** If you ask Claude to set up a project with environment variables, it will typically create a `.gitignore` that excludes `.env` automatically. But always verify.

---

## Real Example: Supabase Keys

In the Build 5 stretch goal, you connect a waitlist form to Supabase. Supabase gives you two values:

| Variable | What it is | Where to find it |
|---|---|---|
| `SUPABASE_URL` | Your project's API address | Supabase dashboard → Settings → API |
| `SUPABASE_ANON_KEY` | A public-safe key for client-side access | Same page, under `anon` `public` |

Your `.env` file looks like:

```
SUPABASE_URL=https://abcdefg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9...
```

In your HTML/JavaScript, you reference them instead of hardcoding:

```javascript
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
```

> **Note:** For a simple static HTML page (like the one in Build 5), you may end up putting the anon key directly in the HTML since there's no build step to inject environment variables. That's okay for the anon key specifically — Supabase designed it to be safe for client-side use. But this is the exception, not the rule.

---

## Real Example: Vercel Deployment

When you deploy on Vercel, your code runs on Vercel's servers — not your laptop. Your laptop's `.env` file doesn't exist there. You need to tell Vercel about your variables separately.

**How to add environment variables on Vercel:**

1. Go to your project on [vercel.com](https://vercel.com)
2. Click **Settings** → **Environment Variables**
3. Add each variable (name + value)
4. Click **Save**
5. **Redeploy** your project (Vercel doesn't pick up new env vars until the next deploy)

| Where your code runs | Where env vars live |
|---|---|
| Your laptop (local dev) | `.env` file in your project folder |
| Vercel (production) | Vercel dashboard → Settings → Environment Variables |
| Supabase Edge Functions | Supabase dashboard → Settings → Edge Functions |

They're the same values, stored in different places depending on where the code executes.

---

## Optional: OpenRouter API Key

If you're using OpenRouter to access different AI models, you'll have an API key that looks like:

```
OPENROUTER_API_KEY=sk-or-v1-abc123...
```

Add it to your `.env` file just like any other variable. This key is **private** — it's tied to your account and billing. Never share it, never commit it.

**To use in Claude Code projects:**

```bash
export OPENROUTER_API_KEY=sk-or-v1-abc123...
```

Or add it to your `.env` file and let your framework load it.

> **Tip:** If you need this key available every time you open the terminal (not just the current session), add the `export` line to your shell profile:
>
> **Mac/Linux:** `~/.zshrc` or `~/.bashrc`
>
> ```bash
> echo 'export OPENROUTER_API_KEY=sk-or-v1-abc123...' >> ~/.zshrc
> source ~/.zshrc
> ```
>
> Replace the key value with your actual key.

---

## What Happens If You Leak a Key

It's not hypothetical. Bots scan GitHub continuously for exposed keys. Here's what happens:

1. **You accidentally push `.env` to GitHub** — within minutes, automated scanners find it
2. **Someone uses your key** — they make API calls on your account, racking up charges or accessing your data
3. **You get a surprise bill or a data breach** — Supabase, OpenRouter, Vercel — all of them bill by usage

**Some platforms help you.** GitHub scans for known key patterns and will email you a warning. Supabase and others may auto-revoke exposed keys. But don't rely on this.

**If you accidentally push a secret:**

1. **Rotate the key immediately** — go to the platform's dashboard and generate a new one. The old key is compromised even if you delete it from GitHub (git history preserves it).
2. **Remove from git history** — this is complex. Ask Claude: "I accidentally committed my .env file. Help me remove it from git history."
3. **Update everywhere** — replace the old key in your `.env`, Vercel dashboard, and anywhere else you used it.

> **Rotating a key** means generating a new one and invalidating the old one. Every platform has this option in their dashboard, usually under API keys or Settings → Security.

---

## Quick Reference

| Concept | What to remember |
|---|---|
| Environment variable | A named value stored outside your code |
| `.env` file | A text file that holds your env vars locally |
| `.gitignore` | Tells git to skip files — always include `.env` |
| `export VAR=value` | Sets an env var in your current terminal session |
| `echo $VAR` | Reads an env var in the terminal |
| Platform dashboard | Where you set env vars for deployed apps (Vercel, Supabase, etc.) |
| Key rotation | Generating a new key after the old one is exposed |

---

## The One Thing to Remember

> **Your code is a recipe. Environment variables are the ingredients you don't want to print on the box.** Keep them in `.env`, keep `.env` out of git, and set them separately on every platform where your code runs.
