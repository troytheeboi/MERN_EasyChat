import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Message = ({ message }) => (
  <Box
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
);

export default Message;
