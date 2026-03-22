# Optional: Connect a Custom Domain on Vercel

Once your site is deployed to Vercel, you'll have a URL like `your-project.vercel.app`. That works fine for sharing. But if you want your site live at your own domain (e.g., `yourproduct.com` or `yourname.com`), follow these steps.

---

## Two paths — pick one

| | Path A: Direct DNS (Quick) | Path B: Cloudflare (Recommended) |
|---|---|---|
| **Setup time** | 5–10 min | 15–20 min |
| **How it works** | Point your registrar's DNS directly to Vercel | Move DNS to Cloudflare, then point to Vercel |
| **Best for** | Getting it done today | Cleaner long-term setup |
| **What you get** | Domain connected | Domain + free CDN + DDoS protection + analytics + SSL + easy future management |

**Our recommendation:** If you're serious about this domain — for a product, a personal brand, anything you'll keep — set up Cloudflare. It takes 15 extra minutes once and saves headaches forever. Most domain registrars (GoDaddy, Namecheap, Google Domains, Hostinger, BigRock) have native integrations with Cloudflare, so the handoff is smooth.

If you just want it working right now, Path A is fine.

---

## Path A: Direct DNS (Quick)

### What you'll need

- A domain you already own
- Access to your domain registrar's DNS settings
- Your Vercel project already deployed

#### Step 1: Add the domain in Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Open your project (the one you deployed during Build 5)
3. Go to **Settings → Domains**
4. Type your domain (e.g., `yourproduct.com`) and click **Add**

Vercel will show you the DNS records you need to add. Keep this page open.

---

### Step 2: Update your DNS records

Log in to wherever you bought your domain. Find the **DNS settings** (sometimes called DNS Management, Zone Editor, or Name Servers).

### Root domain (yourproduct.com) — add an A record:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |

> `@` means the root domain. Some registrars use the domain name itself instead of `@`.

### Subdomain (www.yourproduct.com) — add a CNAME record:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | cname.vercel-dns.com |

**Recommended:** add both, so visitors reaching either version land on your site. Vercel handles the redirect.

---

### Step 3: Wait for DNS propagation

DNS changes typically take **5–30 minutes**, sometimes up to 48 hours in rare cases.

Once propagated, Vercel automatically issues a free SSL certificate and marks the domain as **Valid** in your project settings.

Check propagation status at [dnschecker.org](https://dnschecker.org).

---

### Step 4: Verify in Vercel

Go to **Settings → Domains** in your Vercel project. Once the domain shows a green **Valid** status, your site is live.

---

## Path B: Cloudflare (Recommended for the long run)

Cloudflare is a free DNS and CDN service that sits in front of your domain and gives you a lot more control and performance. Once your domain is on Cloudflare, managing it is much easier — and you get CDN, DDoS protection, analytics, and automatic SSL for free.

**The idea:** instead of pointing your domain directly at Vercel, you point your domain's nameservers at Cloudflare, and then Cloudflare points at Vercel. One extra step upfront, significantly cleaner from here on.

### What you'll need

- A free Cloudflare account (cloudflare.com — sign up takes 2 minutes)
- Your domain and access to your registrar
- Your Vercel project already deployed

---

### Step 1: Add your site to Cloudflare

1. Sign up or log in at [cloudflare.com](https://cloudflare.com)
2. Click **Add a Site**
3. Enter your domain (e.g., `yourproduct.com`) and click **Add Site**
4. Select the **Free plan** and continue

Cloudflare will scan your existing DNS records and import them automatically.

---

### Step 2: Add Vercel DNS records in Cloudflare

In the Cloudflare DNS dashboard, add these records:

**A record (root domain):**

| Type | Name | IPv4 address | Proxy status |
|------|------|-------------|--------------|
| A | @ | 76.76.21.21 | DNS only (grey cloud) |

**CNAME record (www):**

| Type | Name | Target | Proxy status |
|------|------|--------|--------------|
| CNAME | www | cname.vercel-dns.com | DNS only (grey cloud) |

> Set both to **DNS only** (not proxied / orange cloud) for now. Vercel manages its own SSL — proxying through Cloudflare can conflict with Vercel's certificate issuance. Once everything is working, you can enable the proxy if you want Cloudflare's CDN benefits.

---

### Step 3: Update your nameservers at your registrar

Cloudflare will give you two nameservers (e.g., `aria.ns.cloudflare.com` and `bob.ns.cloudflare.com`).

Log in to your domain registrar (GoDaddy, Namecheap, etc.) and replace the existing nameservers with Cloudflare's two nameservers. Each registrar calls this something slightly different — "Name Servers", "Custom DNS", or "Nameserver Management".

> Most major registrars (GoDaddy, Namecheap, Google Domains, Hostinger, BigRock) have native Cloudflare integration — look for a "Connect with Cloudflare" or "Use Cloudflare" option in your registrar dashboard. If it exists, use it — it's even faster.

---

### Step 4: Activate on Cloudflare

Back in Cloudflare, click **Done, check nameservers**. Cloudflare will verify the nameserver change (usually within 5–30 minutes).

Once active, you'll see your domain status turn green in Cloudflare.

---

### Step 5: Add the domain in Vercel

1. Go to your Vercel project → **Settings → Domains**
2. Add your domain (e.g., `yourproduct.com`)
3. Vercel will verify against your Cloudflare DNS records and issue an SSL certificate

---

## Common issues

| Issue | Fix |
|-------|-----|
| Domain shows "Invalid Configuration" in Vercel | Check that DNS records in Cloudflare match Vercel's required values exactly |
| SSL certificate stuck "pending" | Make sure proxy is set to **DNS only** (grey cloud), not **Proxied** (orange cloud) |
| Nameservers not updating | Can take up to 24–48 hours at some registrars. Check status at dnschecker.org |
| Still seeing old site | Clear browser cache or open an incognito window |
| Registrar doesn't allow custom nameservers on free plan | Upgrade to a paid plan, or use Path A (direct DNS) instead |

---

## Ask Claude for help

If you get stuck, paste your situation into Claude:

```
I've deployed my site to Vercel at [your vercel URL]. I want to connect
my custom domain [your domain] which I bought from [registrar name].
I'm trying to [use Cloudflare / point DNS directly].

Here's where I'm stuck: [describe the issue].

Walk me through what might be wrong and how to fix it.
```

---

> **Reminder:** Your `vercel.app` URL is permanent and shareable. A custom domain is optional — useful if this is a real product or personal brand you'll keep running.

