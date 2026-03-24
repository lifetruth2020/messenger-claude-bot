# 🤖 Messenger-Claude Bot
**Facebook Messenger × Claude AI — Arise Media & IT Consultants**

A production-ready webhook server that connects Facebook Messenger to Anthropic's Claude AI, deployed on Railway.

---

## 📁 Project Structure

```
messenger-claude-bot/
├── src/
│   ├── index.js        # Express server entry point
│   ├── webhook.js      # Facebook webhook verification
│   ├── messenger.js    # Messenger send/receive logic
│   └── claude.js       # Claude API integration
├── .env.example        # Environment variable template
├── .gitignore
├── package.json
├── railway.toml        # Railway deployment config
└── README.md
```

---

## 🚀 Deployment Guide

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — Messenger Claude Bot"
git remote add origin https://github.com/YOUR_USERNAME/messenger-claude-bot.git
git push -u origin main
```

### Step 2 — Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click **New Project → Deploy from GitHub repo**
3. Select your `messenger-claude-bot` repo
4. Railway will auto-detect Node.js and deploy

### Step 3 — Set Environment Variables in Railway
Go to your Railway project → **Variables** tab and add:

| Variable | Value |
|----------|-------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | From Facebook Developer Console |
| `FACEBOOK_VERIFY_TOKEN` | Any string you choose (e.g., `arise_media_2024`) |
| `CLAUDE_SYSTEM_PROMPT` | Your custom bot personality/instructions |

### Step 4 — Get Your Railway URL
After deployment, Railway gives you a URL like:
```
https://messenger-claude-bot-production.up.railway.app
```

Your webhook URL will be:
```
https://messenger-claude-bot-production.up.railway.app/webhook
```

---

## 📱 Facebook Setup

### Step 1 — Create a Facebook App
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new App → Select **Business** type
3. Add **Messenger** product

### Step 2 — Connect Your Facebook Page
1. Under Messenger → Settings
2. Generate a **Page Access Token** for your page
3. Copy this token → paste into Railway as `FACEBOOK_PAGE_ACCESS_TOKEN`

### Step 3 — Configure Webhook
1. Under Messenger → Webhooks → **Add Callback URL**
2. Callback URL: `https://YOUR_RAILWAY_URL/webhook`
3. Verify Token: same value as your `FACEBOOK_VERIFY_TOKEN`
4. Subscribe to: `messages`, `messaging_postbacks`
5. Click **Verify and Save**

### Step 4 — Subscribe Page to Webhook
1. Under Webhooks → Add Subscriptions
2. Select your Facebook Page
3. Enable `messages`

---

## 💬 Bot Commands

Users can type these in Messenger:

| Command | Action |
|---------|--------|
| Any message | Claude responds intelligently |
| `help` | Shows help message |
| `reset` or `clear` | Clears conversation history |

---

## ⚙️ Customizing Claude's Behaviour

Edit the `CLAUDE_SYSTEM_PROMPT` environment variable in Railway to change how Claude responds. Examples:

**Customer Service Bot:**
```
You are a customer service assistant for Arise Media. Be helpful, professional, and friendly. Answer questions about our media consultancy and IT services.
```

**Multilingual Bot:**
```
You are a helpful assistant. Always respond in the same language the user writes in. Support Bahasa Indonesia, English, and Arabic.
```

---

## 🔒 Security Notes

- Never commit `.env` to GitHub — it's in `.gitignore`
- Store all secrets in Railway's environment variables
- The `FACEBOOK_VERIFY_TOKEN` can be any string — just keep it consistent

---

## 📊 Scaling for Production

When ready to scale, consider:
- **Database**: Add Railway PostgreSQL to persist conversation history
- **Rate limiting**: Add `express-rate-limit` to protect your endpoint
- **Logging**: Add `winston` for structured logs
- **Monitoring**: Connect Railway metrics to your dashboard

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Fill in your values in .env

# Run locally
npm run dev

# Test webhook locally using ngrok
npx ngrok http 3000
# Use the ngrok HTTPS URL as your Facebook webhook callback
```

---

*Built for Arise Media & IT Consultants — Labuan, Malaysia*
