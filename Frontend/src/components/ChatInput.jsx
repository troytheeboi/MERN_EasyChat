import React, { useRef, useEffect } from "react";
import { Box, HStack, Textarea, IconButton } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";

const ChatInput = ({
  isEmptyState = false,
  inputMessage,
  setInputMessage,
  handleSendMessage,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  return (
    <Box
      p={4}
      borderTop={!isEmptyState && "1px"}
      borderColor="gray.700"
      bg="gray.800"
      borderRadius={isEmptyState ? "xl" : "none"}
      w={isEmptyState ? "600px" : "100%"}
      boxShadow={isEmptyState ? "lg" : "none"}
    >
      <HStack spacing={2} align="end">
        <Textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="What do you want to plan?"
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
          size="lg"
          autoComplete="off"
          resize="none"
          overflowY="auto"
          minHeight="40px"
          maxHeight="200px" // 👈 max height before scroll
          sx={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "gray.600",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
          }}
        />
        <IconButton
          icon={<FaPaperPlane />}
          variant="ghost"
          colorScheme="whiteAlpha"
          color="gray.400"
          aria-label="Send message"
          onClick={handleSendMessage}
          _hover={{ color: "white" }}
        />
      </HStack>
    </Box>
  );
};

export default ChatInput;
