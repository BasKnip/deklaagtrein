# De Klaagtrein — Deployment Guide
## Getting from zero to live site

### Prerequisites
You need these installed on your computer:
- **Node.js** (version 18+) — download from https://nodejs.org (choose LTS)
- **Git** — download from https://git-scm.com/downloads
- A **terminal** (Terminal on Mac, or Command Prompt / PowerShell on Windows)

If you're not sure if you have these, open a terminal and type:
```
node --version
git --version
```
Both should show version numbers. If not, install them first.

---

### Step 1: Create the GitHub repository

1. Go to https://github.com/new
2. **Repository name:** `deklaagtrein`
3. **Description:** `Klachten over de Nederlandse trein — anoniem en openbaar`
4. Set it to **Public** (we're open source, fits the mission)
5. Do NOT check "Add a README file" (we'll push our own)
6. Click **Create repository**
7. You'll see a page with setup instructions — keep this open

---

### Step 2: Download and set up the project

1. Download the `deklaagtrein-starter.tar.gz` file I gave you
2. Extract it somewhere on your computer (e.g. your Desktop or Documents)
3. Open a terminal and navigate to the folder:
   ```
   cd ~/Desktop/deklaagtrein
   ```
   (adjust the path to wherever you extracted it)

4. Install dependencies:
   ```
   npm install
   ```
   This will take a minute. You'll see some warnings — that's normal.

5. Test it locally:
   ```
   npm run dev
   ```
   Open http://localhost:3000 in your browser. You should see the homepage!
   (It'll show "—" for all stats since the database is empty. That's correct.)
   
   Press Ctrl+C to stop the local server.

---

### Step 3: Push to GitHub

In the same terminal, run these commands one by one:

```
git init
git add .
git commit -m "Initial commit: De Klaagtrein"
git branch -M main
git remote add origin https://github.com/BasKnip/deklaagtrein.git
git push -u origin main
```

You may be asked to log in to GitHub — follow the prompts.

---

### Step 4: Deploy on Vercel

1. Go to https://vercel.com/dashboard
2. Click **Add New → Project**
3. You should see your `deklaagtrein` repository listed. Click **Import**.
4. **Framework Preset:** It should auto-detect "Next.js" — if not, select it
5. **Environment Variables:** Click to expand, then add:
   - Name: `NEXT_PUBLIC_SUPABASE_URL` → Value: `https://myaenfhugqdoqlrtrjxd.supabase.co`
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: `sb_publishable_nS2kgRGcMv0TTtFLHmz99w_R8qpwBqG`
6. Click **Deploy**
7. Wait 1-2 minutes. When it's done, Vercel gives you a URL like `deklaagtrein.vercel.app`

**That's it. Your site is live.** 🚂

---

### Step 5: Verify everything works

1. Visit your Vercel URL — you should see the De Klaagtrein homepage
2. Check the Supabase dashboard → Table Editor — you should see all the tables from the schema

---

### What's next

Once this is live, we build in this order:
1. **Complaint form** (/klaag) — the core feature
2. **Dashboard** (/dashboard) — aggregated complaint data
3. **Detail pages** — treinstel, station, route, category
4. **Over ons** (/over-ons) — static content page
5. **NS API integration** — treinstel lookup, journey matching

Every change you make: save, commit, push to GitHub → Vercel auto-deploys.
```
git add .
git commit -m "description of what changed"
git push
```

---

### Troubleshooting

**"npm: command not found"** → Install Node.js from https://nodejs.org
**"git: command not found"** → Install Git from https://git-scm.com
**Vercel build fails** → Check the build logs in Vercel dashboard. Usually a typo or missing env var.
**Database connection fails** → Make sure the Supabase project isn't paused. Check Settings → API for correct URL.
