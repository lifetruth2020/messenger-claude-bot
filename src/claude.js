/**
 * claude.js
 * Handles all Claude API (Anthropic) interactions
 * Arise Media & IT Consultants
 */

const axios = require("axios");

// Conversation memory (in-memory per session)
// For production, replace with a database (e.g., Railway + PostgreSQL)
const conversationHistory = {};

const SYSTEM_PROMPT = process.env.CLAUDE_SYSTEM_PROMPT ||
  `You are a helpful assistant for Arise Media & IT Consultants. 
   You are friendly, professional, and concise in your responses. 
   You help users with questions about media consultancy, IT services, 
   and digital education. Always respond in the same language the user writes in.`;

const askClaude = async (senderId, userMessage) => {
  try {
    // Initialize history for new users
    if (!conversationHistory[senderId]) {
      conversationHistory[senderId] = [];
    }

    // Add user message to history
    conversationHistory[senderId].push({
      role: "user",
      content: userMessage,
    });

    // Keep only last 10 messages to manage token usage
    if (conversationHistory[senderId].length > 10) {
      conversationHistory[senderId] = conversationHistory[senderId].slice(-10);
    }

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: conversationHistory[senderId],
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        timeout: 30000,
      }
    );

    const assistantMessage = response.data.content[0].text;

    // Save assistant reply to history
    conversationHistory[senderId].push({
      role: "assistant",
      content: assistantMessage,
    });

    console.log(`🤖 Claude replied to ${senderId}: ${assistantMessage.substring(0, 80)}...`);
    return assistantMessage;

  } catch (error) {
    console.error("❌ Claude API error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      return "I'm having trouble authenticating. Please contact support.";
    } else if (error.response?.status === 429) {
      return "I'm a little busy right now. Please try again in a moment.";
    } else {
      return "I'm sorry, I encountered an issue processing your message. Please try again.";
    }
  }
};

// Clear conversation history for a user
const clearHistory = (senderId) => {
  delete conversationHistory[senderId];
  console.log(`🗑️ Cleared conversation history for ${senderId}`);
};

module.exports = { askClaude, clearHistory };
