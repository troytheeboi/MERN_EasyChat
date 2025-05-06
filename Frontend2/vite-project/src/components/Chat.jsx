import React, { useState, useEffect, useMemo } from "react";
import {
  Flex,
  Box,
  HStack,
  IconButton,
  Heading,
  useDisclosure,
  useBreakpointValue,
  Button,
} from "@chakra-ui/react";
import { createStandaloneToast } from "@chakra-ui/toast";
import { PanelLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";
import MessageList from "./MessageList";
import { sendMessage, getConversations } from "../services/openaiService";

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
  const { conversationId: paramConversationId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allConversations, setAllConversations] = useState([]);

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

    const filteredChats = allConversations.filter((session) => {
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
  }, [allConversations, searchQuery]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await getConversations(currentPage);
        const formattedConversations = response.conversations.map((conv) => ({
          id: conv.conversationId,
          title: conv.title,
          summary: conv.summary || "No summary available",
          date: new Date(conv.updatedAt).toISOString().split("T")[0],
          messages: conv.messages || [],
          conversationId: conv.conversationId,
        }));

        if (currentPage === 1) {
          setAllConversations(formattedConversations);
        } else {
          setAllConversations((prev) => [...prev, ...formattedConversations]);
        }

        setTotalPages(response.totalPages);
        setHasMore(response.hasMore);

        // If there's a conversation ID in the URL, load that conversation
        if (paramConversationId) {
          const conversation = formattedConversations.find(
            (conv) => conv.conversationId === paramConversationId
          );
          if (conversation) {
            loadChatSession(conversation);
          } else {
            navigate("/chat");
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [currentPage, paramConversationId, navigate]);

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
      setAllConversations((prev) =>
        prev.map((session) =>
          session.id === currentSession.id ? updatedSession : session
        )
      );
      setCurrentSession(updatedSession);
    }

    setInputMessage("");

    try {
      // Create a temporary AI message that will be updated
      const tempAiMessage = {
        id: Date.now() + 1,
        content: "",
        sender: "assistant",
        timestamp: new Date().toISOString(),
      };

      // Add the temporary message to the UI
      setMessages((prev) => [...prev, tempAiMessage]);

      const response = await sendMessage(
        inputMessage,
        currentSession?.conversationId,
        (streamedContent) => {
          // Update the temporary message with the streamed content
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAiMessage.id
                ? { ...msg, content: streamedContent }
                : msg
            )
          );
        }
      );

      const aiMessage = {
        id: tempAiMessage.id,
        content: response.response,
        sender: "assistant",
        timestamp: new Date().toISOString(),
      };

      // Update messages in the chat session
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          messages: [...(currentSession.messages || []), aiMessage],
          conversationId: response.conversationId,
          title: response.title,
          summary: response.summary || "No summary available",
        };
        setChatSessions((prev) =>
          prev.map((session) =>
            session.id === currentSession.id ? updatedSession : session
          )
        );
        setAllConversations((prev) =>
          prev.map((session) =>
            session.id === currentSession.id ? updatedSession : session
          )
        );
        setCurrentSession(updatedSession);
        navigate(`/chat/${response.conversationId}`);
      } else {
        // Create new session if none exists
        const newSession = {
          id: response.conversationId,
          title: response.title,
          summary: response.summary || "No summary available",
          date: new Date().toISOString().split("T")[0],
          messages: [newMessage, aiMessage],
          conversationId: response.conversationId,
        };
        setChatSessions((prev) => [newSession, ...prev]);
        setAllConversations((prev) => [newSession, ...prev]);
        setCurrentSession(newSession);
        navigate(`/chat/${response.conversationId}`);
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
      id: Date.now().toString(),
      title: "New Chat",
      summary: "Start a new conversation",
      date: new Date().toISOString().split("T")[0],
      messages: [],
      conversationId: null,
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setAllConversations((prev) => [newSession, ...prev]);
    setCurrentSession(newSession);
    setMessages([]);
    setShouldFocusInput(true);
    navigate("/chat");
  };

  const loadChatSession = (session) => {
    // Format messages to match the expected structure
    const formattedMessages = session.messages.map((msg) => ({
      id: msg._id || Date.now(),
      content: msg.content,
      sender: msg.role === "user" ? "user" : "assistant",
      timestamp: msg.timestamp || new Date().toISOString(),
    }));

    setCurrentSession(session);
    setMessages(formattedMessages);
    setShouldFocusInput(false);
    navigate(`/chat/${session.conversationId}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentPage={currentPage}
          totalPages={totalPages}
          hasMore={hasMore}
          onPageChange={handlePageChange}
          isLoading={isLoading}
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
