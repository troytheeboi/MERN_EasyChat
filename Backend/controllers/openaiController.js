import OpenAI from "openai";
import dotenv from "dotenv";
import Conversation from "../models/Conversation.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getOpenAIResponse = async (req, res) => {
  try {
    const { prompt, conversationId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let conversation;
    if (conversationId) {
      // Find existing conversation
      conversation = await Conversation.findOne({ conversationId });
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
    } else {
      // Create new conversation
      const newConversationId = uuidv4();
      conversation = await Conversation.create({
        conversationId: newConversationId,
        messages: [],
      });
    }

    // Add user message to conversation
    conversation.messages.push({
      role: "user",
      content: prompt,
    });
    await conversation.save();

    // Prepare messages for OpenAI
    const messages = conversation.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const aiResponse = completion.choices[0].message.content;

    // Add AI response to conversation
    conversation.messages.push({
      role: "assistant",
      content: aiResponse,
    });
    await conversation.save();

    res.json({
      response: aiResponse,
      conversationId: conversation.conversationId,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
};
