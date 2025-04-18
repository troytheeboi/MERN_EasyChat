import React from 'react';
import { Flex, VStack, Heading } from '@chakra-ui/react';
import ChatInput from './ChatInput';

const EmptyState = ({ inputMessage, setInputMessage, handleSendMessage }) => (
    <Flex
        direction="column"
        align="center"
        justify="center"
        flex={1}
        p={4}
        maxW={{ base: "100%", xl: "800px" }}
        mx="auto"
        w="100%"
    >
        <VStack spacing={8} w="100%">
            <Heading
                size="xl"
                color="white"
                textAlign="center"
                fontWeight="medium"
            >
                Let's Start Planning
            </Heading>
            <ChatInput
                isEmptyState={true}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
            />
        </VStack>
    </Flex>
);

export default EmptyState; 