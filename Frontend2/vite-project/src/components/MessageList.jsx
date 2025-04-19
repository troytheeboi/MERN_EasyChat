import React from "react";
import { Box, VStack, Text, Container } from "@chakra-ui/react";

const MessageList = ({ messages }) => (
  <Box
    flex="1"
    overflowY="auto"
    p={4}
    bg="gray.900"
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
      </VStack>
    </Container>
  </Box>
);

export default MessageList;
