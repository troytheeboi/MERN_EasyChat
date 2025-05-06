import { useState, useEffect, useCallback } from "react";
import { chatService } from "../services/chatService";
import { createStandaloneToast } from "@chakra-ui/toast";

const { toast } = createStandaloneToast();

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to message updates
  useEffect(() => {
    const unsubscribe = chatService.subscribe(setMessages);
    return () => unsubscribe();
  }, []);

  // Handle sending a message
  const handleSendMessage = useCallback(
    async (content, conversationId = null) => {
      if (!content.trim()) return;

      try {
        setIsLoading(true);

        // Add user message
        chatService.addUserMessage(content);

        // Send message and get response
        const response = await chatService.sendMessage(content, conversationId);

        // Update session
        if (currentSession) {
          setCurrentSession({
            ...currentSession,
            conversationId: response.conversationId,
            title: response.title,
            summary: response.summary,
          });
        } else {
          setCurrentSession({
            id: response.conversationId,
            title: response.title,
            summary: response.summary,
            date: new Date().toISOString().split("T")[0],
            conversationId: response.conversationId,
          });
        }

        return response;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to get response from AI",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [currentSession]
  );

  // Load a chat session
  const loadChatSession = useCallback((session) => {
    const formattedMessages = session.messages.map((msg) => ({
      id: msg._id || Date.now(),
      content: msg.content,
      sender: msg.role === "user" ? "user" : "assistant",
      timestamp: msg.timestamp || new Date().toISOString(),
    }));

    setCurrentSession(session);
    chatService.setMessages(formattedMessages);
  }, []);

  // Start a new chat
  const startNewChat = useCallback(() => {
    const newSession = {
      id: Date.now().toString(),
      title: "New Chat",
      summary: "Start a new conversation",
      date: new Date().toISOString().split("T")[0],
      messages: [],
      conversationId: null,
    };

    setCurrentSession(newSession);
    chatService.setMessages([]);
  }, []);

  return {
    messages,
    currentSession,
    isLoading,
    handleSendMessage,
    loadChatSession,
    startNewChat,
  };
};
