import { sendMessage as sendOpenAIMessage } from "./openaiService";

export class ChatService {
  constructor() {
    this.messageHandlers = new Set();
  }

  // Subscribe to message updates
  subscribe(handler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  // Notify all subscribers of message updates
  notifySubscribers(messages) {
    this.messageHandlers.forEach((handler) => handler(messages));
  }

  // Send a message and handle streaming
  async sendMessage(prompt, conversationId = null) {
    try {
      const tempMessage = {
        id: Date.now() + 1,
        content: "",
        sender: "assistant",
        timestamp: new Date().toISOString(),
      };

      // Notify subscribers of the temporary message
      this.notifySubscribers([...this.currentMessages, tempMessage]);

      const response = await sendOpenAIMessage(
        prompt,
        conversationId,
        (streamedContent) => {
          // Update the temporary message with streamed content
          const updatedMessages = this.currentMessages.map((msg) =>
            msg.id === tempMessage.id
              ? { ...msg, content: streamedContent }
              : msg
          );
          this.currentMessages = updatedMessages;
          this.notifySubscribers(updatedMessages);
        }
      );

      // Update the final message
      const finalMessage = {
        id: tempMessage.id,
        content: response.response,
        sender: "assistant",
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = this.currentMessages.map((msg) =>
        msg.id === tempMessage.id ? finalMessage : msg
      );
      this.currentMessages = updatedMessages;
      this.notifySubscribers(updatedMessages);

      return {
        message: finalMessage,
        conversationId: response.conversationId,
        title: response.title,
        summary: response.summary,
      };
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  // Add a user message
  addUserMessage(content) {
    const newMessage = {
      id: Date.now(),
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    this.currentMessages = [...this.currentMessages, newMessage];
    this.notifySubscribers(this.currentMessages);
    return newMessage;
  }

  // Set current messages
  setMessages(messages) {
    this.currentMessages = messages;
    this.notifySubscribers(messages);
  }

  // Get current messages
  getMessages() {
    return this.currentMessages;
  }
}

// Create a singleton instance
export const chatService = new ChatService();
