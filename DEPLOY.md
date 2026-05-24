# 🚀 InterviewAI — Complete Deployment Guide

Deploy your app live in ~20 minutes using:
- **Frontend** → Vercel (free)
- **Backend** → Railway (free $5/month credit)
- **Database** → MongoDB Atlas (free 512MB)

---

## Step 1 — Push to GitHub

```bash
# In the interview-platform folder
git init
git add .
git commit -m "Initial commit — InterviewAI platform"

# Create a new repo at github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/interviewai.git
git push -u origin main
```

---

## Step 2 — MongoDB Atlas (Database)

1. Go to **https://mongodb.com/atlas** → sign up free
2. Create a **free M0 cluster** (512MB, no credit card)
3. Under **Security → Database Access** → Add user:
   - Username: `interviewai`
   - Password: generate a strong password (save it!)
   - Role: `Read and write to any database`
4. Under **Security → Network Access** → Add IP:
   - Click **Allow Access from Anywhere** → `0.0.0.0/0`
5. Under **Deployment → Database** → click **Connect**:
   - Choose **Drivers** → Node.js
   - Copy the connection string — looks like:
   ```
   mongodb+srv://interviewai:<password>@cluster0.abc123.mongodb.net/
   ```
   - Replace `<password>` with your actual password
   - Add `/interviewai` before the `?`:
   ```
   mongodb+srv://interviewai:YOURPASS@cluster0.abc123.mongodb.net/interviewai?retryWrites=true&w=majority
   ```
   - **Save this string** — you'll need it in Railway

---

## Step 3 — Railway (Backend)

1. Go to **https://railway.app** → sign up with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `interviewai` repo
4. Railway auto-detects Node.js. Set the **root directory** to `backend`:
   - Click your service → **Settings** → **Root Directory** → type `backend`
5. Go to **Variables** tab → add all these:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | your Atlas connection string |
| `JWT_SECRET` | run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `ANTHROPIC_API_KEY` | from console.anthropic.com |
| `CLIENT_URL` | `https://interviewai.vercel.app` (update after Vercel deploy) |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | your Gmail address |
| `SMTP_PASS` | Gmail App Password (see below) |

6. Click **Deploy** → wait ~2 minutes
7. Go to **Settings** → **Networking** → **Generate Domain**
   - You'll get a URL like `interviewai-backend.up.railway.app`
   - **Save this** — needed for Vercel

**Gmail App Password:**
- Go to myaccount.google.com → Security → 2-Step Verification (enable it)
- Then → App Passwords → Select app: Mail → Generate
- Copy the 16-character password

**Test your backend:**
```bash
curl https://interviewai-backend.up.railway.app/api/health
# Should return: {"status":"ok","version":"2.5.0",...}
```

---

## Step 4 — Vercel (Frontend)

1. Go to **https://vercel.com** → sign up with GitHub
2. Click **Add New** → **Project** → import your repo
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (leave as is, not `backend`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Under **Environment Variables** → add:

| Variable | Value |
|---|---|
| `REACT_APP_API_URL` | `https://interviewai-backend.up.railway.app/api` |

5. Click **Deploy** → wait ~3 minutes
6. Your app is live at `https://interviewai-[random].vercel.app`

**Add a custom domain (optional):**
- Vercel → your project → **Settings** → **Domains**
- Add `interviewai.in` or similar, follow DNS instructions

---

## Step 5 — Update CORS

After Vercel gives you your URL, update Railway:

1. Go to Railway → your service → **Variables**
2. Update `CLIENT_URL` to your actual Vercel URL:
   ```
   CLIENT_URL=https://interviewai-abc123.vercel.app
   ```
3. Railway auto-redeploys

---

## Step 6 — Verify Everything Works

Open your Vercel URL and test:

- [ ] Landing page loads
- [ ] Click "Get Started" → login page appears
- [ ] Register a new account → welcome email received
- [ ] Dashboard loads with mock data
- [ ] Start an AI interview → Claude responds
- [ ] Upload a resume → analysis appears
- [ ] Download a certificate → PDF generates

---

## Environment Summary

| Service | URL | Purpose |
|---|---|---|
| Vercel | `https://interviewai.vercel.app` | React frontend |
| Railway | `https://interviewai-backend.up.railway.app` | Node.js API |
| MongoDB Atlas | cloud.mongodb.com | Database |
| Anthropic | console.anthropic.com | AI (Claude) |

---

## Costs

| Service | Free Tier | Paid |
|---|---|---|
| Vercel | Unlimited hobby projects | $20/mo Pro |
| Railway | $5/mo free credit | ~$5-10/mo for small app |
| MongoDB Atlas | 512MB free forever | $57/mo M10 cluster |
| Anthropic API | Pay per use | ~$0.003 per interview |

**Estimated cost for 100 users/month: ~$5-10 total**

---

## Common Issues

**CORS error in browser console:**
→ Check `CLIENT_URL` in Railway exactly matches your Vercel domain (no trailing slash)

**MongoDB connection timeout:**
→ Check Network Access in Atlas allows `0.0.0.0/0`
→ Check your connection string has the correct password

**API calls return 404:**
→ Check `REACT_APP_API_URL` in Vercel is set correctly and ends with `/api`
→ Redeploy frontend after adding env vars

**Emails not sending:**
→ Make sure you're using an **App Password**, not your Gmail password
→ Check that 2FA is enabled on your Google account

**Claude not responding:**
→ Verify `ANTHROPIC_API_KEY` starts with `sk-ant-`
→ Check your Anthropic account has credit

---

## Redeployment

**Frontend** — every `git push` to `main` auto-deploys on Vercel

**Backend** — every `git push` to `main` auto-deploys on Railway

```bash
# Make a change and deploy
git add .
git commit -m "Update feature X"
git push origin main
# Both Vercel and Railway redeploy automatically ✓
```

---

## Monitoring

- **Vercel** → Analytics tab shows page views, response times
- **Railway** → Logs tab shows server logs in real-time
- **MongoDB Atlas** → Monitoring tab shows query performance
- Add **Sentry** for error tracking (free tier available)

---

**Your app is now live! 🎉**

Share your Vercel URL with students and start onboarding users.
