/**
 * webhook.js
 * Handles Facebook Messenger webhook verification
 * Arise Media & IT Consultants
 */

const verifyWebhook = (req, res) => {
  const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verified successfully by Facebook");
      return res.status(200).send(challenge);
    } else {
      console.error("❌ Webhook verification failed — token mismatch");
      return res.sendStatus(403);
    }
  }

  return res.sendStatus(400);
};

module.exports = { verifyWebhook };
