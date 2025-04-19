import React, { useRef, useEffect } from "react";
import { Box, Container, Textarea, IconButton } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";

const ChatInput = ({
  isEmptyState = false,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  autoFocus = false,
  currentSession,
}) => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(
        textarea.scrollHeight,
        isEmptyState ? 150 : 120
      );
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [inputMessage, autoFocus]);

  return (
    <Box
      p={isEmptyState ? 0 : 4}
      bg={isEmptyState ? "transparent" : "gray.900"}
      borderTop={!isEmptyState && currentSession ? "1px" : "none"}
      borderColor="gray.700"
      position="relative"
      w="100%"
    >
      <Container maxW="container.lg" p={isEmptyState ? 0 : null}>
        <Box
          position="relative"
          bg="gray.800"
          borderRadius="2xl"
          overflow="hidden"
          boxShadow={isEmptyState ? "xl" : "none"}
          borderColor={isEmptyState ? "gray.700" : "transparent"}
          borderWidth={isEmptyState ? "1px" : "0"}
        >
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
            }}
            placeholder={
              isEmptyState
                ? "What would you like to plan?"
                : "Type your message..."
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            bg="transparent"
            border="none"
            color="white"
            _placeholder={{ color: "gray.400" }}
            _focus={{ border: "none", boxShadow: "none" }}
            p={5}
            pr={14}
            rows={1}
            resize="none"
            minH={isEmptyState ? "60px" : "50px"}
            maxH={isEmptyState ? "150px" : "120px"}
            fontSize={isEmptyState ? "lg" : "md"}
            lineHeight="1.6"
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
          />
          <IconButton
            icon={<FaPaperPlane />}
            position="absolute"
            bottom={4}
            right={4}
            colorScheme="blue"
            size={isEmptyState ? "md" : "sm"}
            aria-label="Send message"
            onClick={handleSendMessage}
            isDisabled={!inputMessage.trim()}
            zIndex={1}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ChatInput;
