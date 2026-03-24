/**
 * messenger.js
 * Handles Facebook Messenger send & receive logic
 * Arise Media & IT Consultants
 */

const axios = require("axios");
const { askClaude, clearHistory } = require("./claude");

const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const MESSENGER_API = "https://graph.facebook.com/v18.0/me/messages";

// Send typing indicator to show Claude is processing
const sendTypingOn = async (recipientId) => {
  try {
    await axios.post(
      MESSENGER_API,
      {
        recipient: { id: recipientId },
        sender_action: "typing_on",
      },
      {
        params: { access_token: PAGE_ACCESS_TOKEN },
      }
    );
  } catch (err) {
    console.error("Typing indicator error:", err.message);
  }
};

// Send text reply back to Messenger user
const sendMessage = async (recipientId, text) => {
  // Facebook Messenger has a 2000 character limit per message
  const chunks = splitMessage(text, 2000);

  for (const chunk of chunks) {
    try {
      await axios.post(
        MESSENGER_API,
        {
          recipient: { id: recipientId },
          message: { text: chunk },
          messaging_type: "RESPONSE",
        },
        {
          params: { access_token: PAGE_ACCESS_TOKEN },
        }
      );
      console.log(`📤 Sent message to ${recipientId}`);
    } catch (error) {
      console.error("❌ Messenger send error:", error.response?.data || error.message);
    }
  }
};

// Split long messages into chunks
const splitMessage = (text, maxLength) => {
  if (text.length <= maxLength) return [text];
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxLength));
    i += maxLength;
  }
  return chunks;
};

// Main handler — processes incoming Messenger events
const handleMessage = async (event) => {
  const senderId = event.sender.id;
  const messageText = event.message?.text;
  const attachments = event.message?.attachments;

  console.log(`📩 Message from ${senderId}: ${messageText || "[attachment]"}`);

  // Handle special commands
  if (messageText) {
    const lowerText = messageText.trim().toLowerCase();

    if (lowerText === "/reset" || lowerText === "reset" || lowerText === "clear") {
      clearHistory(senderId);
      await sendMessage(senderId, "Conversation reset. How can I help you today?");
      return;
    }

    if (lowerText === "/help" || lowerText === "help") {
      await sendMessage(
        senderId,
        "Hello! I'm the Arise Media AI Assistant powered by Claude.\n\n" +
        "You can:\n" +
        "• Ask me anything — I'll respond intelligently\n" +
        "• Type 'reset' to start a fresh conversation\n" +
        "• Type 'help' to see this message again\n\n" +
        "How can I assist you today?"
      );
      return;
    }

    // Show typing indicator while Claude processes
    await sendTypingOn(senderId);

    // Get Claude's response
    const reply = await askClaude(senderId, messageText);

    // Send reply back to user
    await sendMessage(senderId, reply);

  } else if (attachments) {
    // Handle attachments (images, files, etc.)
    await sendMessage(
      senderId,
      "Thank you for sending that! I can currently only process text messages. " +
      "Please type your question and I'll be happy to help."
    );
  }
};

module.exports = { handleMessage, sendMessage };
