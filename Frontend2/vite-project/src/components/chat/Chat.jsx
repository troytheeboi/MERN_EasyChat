import React, { useState, useEffect } from "react";
import { Flex, Box, useDisclosure, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";
import MessageList from "./MessageList";
import { useChat } from "../../hooks/useChat";
import { getConversations } from "../../services/openaiService";

const Chat = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allConversations, setAllConversations] = useState([]);

  const navigate = useNavigate();
  const { conversationId: paramConversationId } = useParams();
  const variant = useBreakpointValue({ base: "drawer", lg: "sidebar" });

  const {
    messages,
    currentSession,
    handleSendMessage,
    loadChatSession,
    startNewChat,
  } = useChat();

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
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [currentPage, paramConversationId, navigate, loadChatSession]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    try {
      const response = await handleSendMessage(
        inputMessage,
        currentSession?.conversationId
      );

      setInputMessage("");
      navigate(`/chat/${response.conversationId}`);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleStartNewChat = () => {
    startNewChat();
    setMessages([]);
    setShouldFocusInput(true);
    navigate("/chat");
  };

  return (
    <Flex h="100vh" bg="gray.900">
      <Sidebar
        onClose={onClose}
        isOpen={isOpen}
        variant={variant}
        startNewChat={handleStartNewChat}
        groupedChats={allConversations}
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
              handleSendMessage={handleSend}
              autoFocus={shouldFocusInput}
            />
          </>
        ) : (
          <EmptyState
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSend}
            onStartNewChat={handleStartNewChat}
          />
        )}
      </Box>
    </Flex>
  );
};

export default Chat;
