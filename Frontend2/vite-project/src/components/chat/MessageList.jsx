import React, { useEffect } from "react";
import { Box, Container, VStack } from "@chakra-ui/react";
import { useScrollToBottom } from "../../hooks/useScrollToBottom";
import Message from "./Message";
import ScrollToBottomButton from "../ui/ScrollToBottomButton";
import { scrollbarStyles } from "../../styles/scrollbar";

const MessageList = ({ messages }) => {
  const {
    messagesEndRef,
    containerRef,
    showScrollButton,
    scrollToBottom,
    handleMessagesUpdate,
  } = useScrollToBottom();

  useEffect(() => {
    handleMessagesUpdate(messages);
  }, [messages, handleMessagesUpdate]);

  return (
    <Box
      ref={containerRef}
      flex="1"
      overflowY="auto"
      p={4}
      bg="gray.900"
      position="relative"
      sx={scrollbarStyles}
    >
      <Container maxW="container.lg">
        <VStack spacing={6} align="stretch">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </Container>

      {showScrollButton && <ScrollToBottomButton onClick={scrollToBottom} />}
    </Box>
  );
};

export default MessageList;
