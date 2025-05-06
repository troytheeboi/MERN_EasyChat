import OpenAI from "openai";
import dotenv from "dotenv";
import Conversation from "../models/Conversation.js";
import { v4 as uuidv4 } from "uuid";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateTitle = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Generate a short, descriptive title (max 5 words) for this conversation based on the first message. The title should be concise and capture the main topic.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 20,
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating title:", error);
    return "New Chat";
  }
};

const generateSummary = async (messages) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Generate a concise summary 1 sentance of this conversation. Focus on the main topics discussed and any decisions or conclusions reached.",
        },
        {
          role: "user",
          content: messages
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join("\n"),
        },
      ],
      max_tokens: 100,
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating summary:", error);
    return null;
  }
};

export const getOpenAIResponse = async (req, res) => {
  try {
    const { prompt, conversationId, googleId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!googleId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    let conversation;
    if (conversationId) {
      // Find existing conversation
      conversation = await Conversation.findOne({ conversationId, googleId });
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
    } else {
      // Generate title from first message
      const title = await generateTitle(prompt);

      // Create new conversation
      const newConversationId = uuidv4();
      conversation = await Conversation.create({
        conversationId: newConversationId,
        googleId,
        title,
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

    // Set up streaming response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Add AI response to conversation
    conversation.messages.push({
      role: "assistant",
      content: fullResponse,
    });

    // Generate summary after 5th response (when messages.length is 10 - 5 pairs of user/assistant)
    if (conversation.messages.length === 10 && !conversation.summary) {
      const summary = await generateSummary(conversation.messages);
      conversation.summary = summary;
    }

    await conversation.save();

    // Send final message with conversation metadata
    res.write(
      `data: ${JSON.stringify({
        done: true,
        conversationId: conversation.conversationId,
        title: conversation.title,
        summary: conversation.summary,
      })}\n\n`
    );

    res.end();
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
};

export const getConversationsByGoogleId = async (req, res) => {
  try {
    const { googleId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    if (!googleId) {
      return res.status(400).json({ error: "Google ID is required" });
    }

    const total = await Conversation.countDocuments({ googleId });
    const conversations = await Conversation.find({ googleId })
      .sort({ updatedAt: -1 })
      .select("conversationId title summary updatedAt messages")
      .skip(skip)
      .limit(limit);

    res.json({
      conversations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ error: "Failed to get conversations" });
  }
};
