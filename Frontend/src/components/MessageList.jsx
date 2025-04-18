import React from 'react';
import { Box, VStack, HStack, Text, Avatar } from '@chakra-ui/react';

const MessageList = ({ messages }) => (
    <Box flex="1" overflowY="auto" p={4}>
        <VStack spacing={4} align="stretch">
            {messages.map((message, index) => (
                <HStack
                    key={index}
                    spacing={3}
                    align="flex-start"
                    justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                >
                    {message.sender === 'ai' && (
                        <Avatar
                            size="sm"
                            name="AI Assistant"
                            src="https://bit.ly/broken-link"
                        />
                    )}
                    <Box
                        bg={message.sender === 'user' ? 'blue.500' : 'gray.700'}
                        color="white"
                        p={3}
                        borderRadius="lg"
                        maxW={{ base: "85%", md: "70%" }}
                        boxShadow="sm"
                    >
                        <Text>{message.text}</Text>
                    </Box>
                    {message.sender === 'user' && (
                        <Avatar
                            size="sm"
                            name="User"
                            src="https://bit.ly/broken-link"
                        />
                    )}
                </HStack>
            ))}
        </VStack>
    </Box>
);

export default MessageList; 