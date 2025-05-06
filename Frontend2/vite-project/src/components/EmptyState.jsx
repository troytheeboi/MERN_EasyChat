import React from "react";
import { Flex, VStack, Heading, Box, Text } from "@chakra-ui/react";
import ChatInput from "./ChatInput";

const EmptyState = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  onStartNewChat,
}) => {
  const handleEmptyStateSend = async () => {
    if (!inputMessage.trim()) return;
    onStartNewChat();
    // Small delay to ensure the chat session is created
    await new Promise((resolve) => setTimeout(resolve, 0));
    handleSendMessage();
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      flex={1}
      p={8}
      maxW="800px"
      mx="auto"
      w="100%"
    >
      <VStack spacing={8} w="100%">
        <VStack spacing={3}>
          <Heading
            size="2xl"
            color="white"
            textAlign="center"
            fontWeight="medium"
            letterSpacing="-0.5px"
          >
            Welcome to Easy Chat
          </Heading>
          <Text fontSize="lg" color="gray.400" textAlign="center">
            Start a conversation with your AI assistant
          </Text>
        </VStack>
        <Box w="100%" maxW="700px">
          <ChatInput
            isEmptyState={true}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleEmptyStateSend}
          />
        </Box>
      </VStack>
    </Flex>
  );
};

export default EmptyState;
