import React, { useState, useEffect, useMemo } from "react";
import {
  Flex,
  Box,
  HStack,
  IconButton,
  Heading,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { createStandaloneToast } from "@chakra-ui/toast";
import { PanelLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";
import MessageList from "./MessageList";
import { sendMessage } from "../services/openaiService";

const { ToastContainer, toast } = createStandaloneToast();

const Chat = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [chatSessions, setChatSessions] = useState([
    {
      id: 1,
      title: "Weekly Planning Session",
      summary: "Discussion about upcoming week's tasks and priorities",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      messages: [
        {
          id: 1,
          content: "Let's plan out this week's tasks.",
          sender: "user",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          content:
            "I can help you organize your priorities. What's the main focus for this week?",
          sender: "assistant",
          timestamp: new Date(
            Date.now() - 24 * 60 * 60 * 1000 + 1000
          ).toISOString(),
        },
      ],
    },
    {
      id: 2,
      title: "Project Brainstorming",
      summary: "Ideas and concepts for the new project implementation",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      messages: [
        {
          id: 3,
          content: "I need some ideas for the new project implementation.",
          sender: "user",
          timestamp: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          id: 4,
          content:
            "I'd be happy to help brainstorm. What's the main goal of the project?",
          sender: "assistant",
          timestamp: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000 + 1000
          ).toISOString(),
        },
      ],
    },
    {
      id: 3,
      title: "Task Organization",
      summary: "Organizing and prioritizing current tasks",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      messages: [
        {
          id: 5,
          content: "I need help organizing my tasks better.",
          sender: "user",
          timestamp: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          id: 6,
          content:
            "Let's create a structured plan. What are your current tasks?",
          sender: "assistant",
          timestamp: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000 + 1000
          ).toISOString(),
        },
      ],
    },
  ]);
  const [currentSession, setCurrentSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const variant = useBreakpointValue({ base: "drawer", lg: "sidebar" });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("googleAccessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    if (variant === "drawer") {
      if (isOpen) onClose();
      else onOpen();
    } else {
      setIsSidebarVisible(!isSidebarVisible);
    }
  };

  const groupedChats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);

    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);

    const filteredChats = chatSessions.filter((session) => {
      if (!searchQuery) return true;
      return (
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    return filteredChats.reduce((acc, session) => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      let group = "Older";
      if (sessionDate.getTime() === today.getTime()) {
        group = "Today";
      } else if (sessionDate.getTime() === yesterday.getTime()) {
        group = "Yesterday";
      } else if (sessionDate >= last7Days) {
        group = "Last 7 Days";
      } else if (sessionDate >= last30Days) {
        group = "Last 30 Days";
      } else {
        const monthYear = sessionDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        group = monthYear;
      }

      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(session);
      return acc;
    }, {});
  }, [chatSessions, searchQuery]);

  useEffect(() => {
    const savedSessions = localStorage.getItem("chatSessions");
    if (savedSessions) {
      setChatSessions(JSON.parse(savedSessions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
  }, [chatSessions]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    // Update messages in the current view
    setMessages((prev) => [...prev, newMessage]);

    // Update messages in the chat session
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        messages: [...(currentSession.messages || []), newMessage],
      };
      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === currentSession.id ? updatedSession : session
        )
      );
      setCurrentSession(updatedSession);
    }

    setInputMessage("");

    try {
      const response = await sendMessage(
        inputMessage,
        currentSession?.conversationId,
        currentSession?.title
      );

      const aiMessage = {
        id: Date.now() + 1,
        content: response.response,
        sender: "assistant",
        timestamp: new Date().toISOString(),
      };

      // Update messages in the current view
      setMessages((prev) => [...prev, aiMessage]);

      // Update messages in the chat session
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          messages: [...(currentSession.messages || []), aiMessage],
          conversationId: response.conversationId,
          title: response.title,
          summary: response.summary || currentSession.summary,
        };
        setChatSessions((prev) =>
          prev.map((session) =>
            session.id === currentSession.id ? updatedSession : session
          )
        );
        setCurrentSession(updatedSession);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const startNewChat = () => {
    const newSession = {
      id: Date.now(),
      title: "New Chat",
      summary: "Start a new conversation",
      date: new Date().toISOString().split("T")[0],
      messages: [],
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSession(newSession);
    setMessages([]);
    setShouldFocusInput(true);
  };

  const loadChatSession = (session) => {
    setCurrentSession(session);
    setMessages(session.messages || []);
    setShouldFocusInput(false);
  };

  return (
    <>
      <ToastContainer />
      <Flex h="100vh" bg="gray.900">
        <Sidebar
          onClose={onClose}
          isOpen={isOpen}
          variant={variant}
          startNewChat={startNewChat}
          groupedChats={groupedChats}
          currentSession={currentSession}
          loadChatSession={loadChatSession}
          isSidebarVisible={isSidebarVisible}
          toggleSidebar={toggleSidebar}
        />
        <Box flex="1" display="flex" flexDirection="column">
          {currentSession ? (
            <>
              <MessageList messages={messages} />
              <ChatInput
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
                autoFocus={shouldFocusInput}
              />
            </>
          ) : (
            <EmptyState
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              onStartNewChat={startNewChat}
            />
          )}
        </Box>
      </Flex>
    </>
  );
};

export default Chat;
