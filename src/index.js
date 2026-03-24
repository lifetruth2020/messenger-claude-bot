require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { handleMessage } = require("./messenger");
const { verifyWebhook } = require("./webhook");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check — Railway uses this
app.get("/", (req, res) => {
  res.status(200).json({
    status: "running",
    service: "Messenger-Claude Bot",
    organization: "Arise Media & IT Consultants",
    timestamp: new Date().toISOString(),
  });
});

// Facebook Webhook Verification (GET)
app.get("/webhook", verifyWebhook);

// Facebook Webhook Events (POST)
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object !== "page") {
    return res.sendStatus(404);
  }

  // Acknowledge receipt immediately (Facebook requires < 5s response)
  res.sendStatus(200);

  // Process each entry asynchronously
  for (const entry of body.entry) {
    const messagingEvents = entry.messaging;
    if (!messagingEvents) continue;

    for (const event of messagingEvents) {
      if (event.message && !event.message.is_echo) {
        await handleMessage(event);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Messenger-Claude Bot running on port ${PORT}`);
  console.log(`🌐 Webhook URL: https://YOUR_RAILWAY_URL/webhook`);
});
