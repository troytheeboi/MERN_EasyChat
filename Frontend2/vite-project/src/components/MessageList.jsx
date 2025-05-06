import React, { useRef, useEffect, useState } from "react";
import { Box, VStack, Text, Container, IconButton } from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const lastContentRef = useRef("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    // Check if this is a streaming message (assistant's message that's being updated)
    const isStreamingMessage =
      lastMessage.sender === "assistant" &&
      lastMessage.content !== lastContentRef.current;

    setIsStreaming(isStreamingMessage);
    lastContentRef.current = lastMessage.content;

    // Only auto-scroll if we're near the bottom
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (isNearBottom) {
        scrollToBottom();
      }
    }
  }, [messages]);

  return (
    <Box
      ref={containerRef}
      flex="1"
      overflowY="auto"
      p={4}
      bg="gray.900"
      position="relative"
      sx={{
        "&::-webkit-scrollbar": {
          width: "8px",
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "gray.600",
          borderRadius: "4px",
          border: "2px solid transparent",
          backgroundClip: "content-box",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "gray.500",
        },
        scrollbarWidth: "thin",
        scrollbarColor: "var(--chakra-colors-gray-600) transparent",
      }}
    >
      <Container maxW="container.lg">
        <VStack spacing={6} align="stretch">
          {messages.map((message) => (
            <Box
              key={message.id}
              alignSelf={message.sender === "user" ? "flex-end" : "flex-start"}
              maxW={{ base: "90%", md: "70%" }}
            >
              {message.sender === "assistant" && (
                <Text fontSize="sm" color="gray.400" mb={1} ml={1}>
                  Assistant
                </Text>
              )}
              <Box
                bg={message.sender === "user" ? "blue.600" : "gray.700"}
                color="white"
                p={4}
                borderRadius="xl"
                boxShadow="sm"
              >
                <Text fontSize="md" lineHeight="1.6">
                  {message.content}
                </Text>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </Container>

      {showScrollButton && (
        <IconButton
          icon={<ChevronDown />}
          position="fixed"
          bottom="100px"
          right="20px"
          colorScheme="blue"
          borderRadius="full"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          size="lg"
          boxShadow="lg"
          _hover={{ transform: "scale(1.1)" }}
          transition="all 0.2s"
        />
      )}
    </Box>
  );
};

export default MessageList;
