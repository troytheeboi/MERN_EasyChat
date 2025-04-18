import React, { useState, useEffect, useMemo } from 'react';
import { Flex, Box, HStack, IconButton, Heading, useDisclosure, useBreakpointValue, useToast } from '@chakra-ui/react';
import { PanelLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatInput from './ChatInput';
import EmptyState from './EmptyState';
import MessageList from './MessageList';

const Chat = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [chatSessions, setChatSessions] = useState([
        {
            id: 1,
            title: "Weekly Planning Session",
            summary: "Discussion about upcoming week's tasks and priorities",
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            messages: []
        },
        {
            id: 2,
            title: "Project Brainstorming",
            summary: "Ideas and concepts for the new project implementation",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            messages: []
        },
        {
            id: 3,
            title: "Task Organization",
            summary: "Organizing and prioritizing current tasks",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            messages: []
        }
    ]);
    const [currentSession, setCurrentSession] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    const variant = useBreakpointValue({ base: 'drawer', lg: 'sidebar' });

    const toggleSidebar = () => {
        if (variant === 'drawer') {
            if (isOpen) onClose();
            else onOpen();
        } else {
            setIsSidebarVisible(!isSidebarVisible);
        }
    };

    const groupedChats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);

        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);

        const filteredChats = chatSessions.filter(session => {
            if (!searchQuery) return true;
            return session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                session.summary.toLowerCase().includes(searchQuery.toLowerCase());
        });

        return filteredChats.reduce((acc, session) => {
            const sessionDate = new Date(session.date);
            sessionDate.setHours(0, 0, 0, 0);

            let group = 'Older';
            if (sessionDate.getTime() === today.getTime()) {
                group = 'Today';
            } else if (sessionDate.getTime() === yesterday.getTime()) {
                group = 'Yesterday';
            } else if (sessionDate >= last7Days) {
                group = 'Last 7 Days';
            } else if (sessionDate >= last30Days) {
                group = 'Last 30 Days';
            } else {
                const monthYear = sessionDate.toLocaleString('default', { month: 'long', year: 'numeric' });
                group = monthYear;
            }

            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(session);
            return acc;
        }, {});
    }, [chatSessions, searchQuery]);

    useEffect(() => {
        const savedSessions = localStorage.getItem('chatSessions');
        if (savedSessions) {
            setChatSessions(JSON.parse(savedSessions));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    }, [chatSessions]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        if (!currentSession) {
            const newSession = {
                id: Date.now(),
                title: inputMessage.slice(0, 30) + (inputMessage.length > 30 ? '...' : ''),
                summary: 'Starting a new conversation',
                date: new Date().toISOString().split('T')[0],
                messages: []
            };

            setChatSessions(prev => [newSession, ...prev]);
            setCurrentSession(newSession);
        }

        const userMessage = {
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputMessage('');

        try {
            const aiResponse = {
                text: 'This is a placeholder AI response. Implement your AI integration here.',
                sender: 'ai',
                timestamp: new Date().toISOString(),
            };

            setTimeout(() => {
                const newMessages = [...updatedMessages, aiResponse];
                setMessages(newMessages);

                setChatSessions(prevSessions =>
                    prevSessions.map(session =>
                        session.id === currentSession?.id
                            ? { ...session, messages: newMessages }
                            : session
                    )
                );
            }, 1000);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to get AI response',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const startNewChat = () => {
        const newSession = {
            id: Date.now(),
            title: 'New Chat',
            summary: 'Starting a new conversation',
            date: new Date().toISOString().split('T')[0],
            messages: []
        };

        setChatSessions(prev => [newSession, ...prev]);
        setCurrentSession(newSession);
        setMessages([]);
    };

    const loadChatSession = (session) => {
        setCurrentSession(session);
        setMessages(session.messages);
    };

    return (
        <Flex h="100vh" bg="gray.900">
            {variant === 'sidebar' && (
                <Sidebar
                    variant="sidebar"
                    isOpen={isOpen}
                    onClose={onClose}
                    startNewChat={startNewChat}
                    groupedChats={groupedChats}
                    currentSession={currentSession}
                    loadChatSession={loadChatSession}
                    isSidebarVisible={isSidebarVisible}
                    toggleSidebar={toggleSidebar}
                />
            )}

            <Flex direction="column" flex="1">
                {variant === 'drawer' && (
                    <>
                        <Box p={4} borderBottom="1px" borderColor="gray.700">
                            <HStack>
                                <IconButton
                                    icon={<PanelLeft size={20} />}
                                    onClick={toggleSidebar}
                                    variant="ghost"
                                    colorScheme="whiteAlpha"
                                    aria-label={isOpen ? "Hide sidebar" : "Show sidebar"}
                                    color="white"
                                    _hover={{ bg: 'whiteAlpha.200' }}
                                />
                                <Heading size="md" color="white">My Planner</Heading>
                            </HStack>
                        </Box>
                        <Sidebar
                            variant="drawer"
                            isOpen={isOpen}
                            onClose={onClose}
                            startNewChat={startNewChat}
                            groupedChats={groupedChats}
                            currentSession={currentSession}
                            loadChatSession={loadChatSession}
                            isSidebarVisible={isSidebarVisible}
                            toggleSidebar={toggleSidebar}
                        />
                    </>
                )}

                {!currentSession ? (
                    <EmptyState
                        inputMessage={inputMessage}
                        setInputMessage={setInputMessage}
                        handleSendMessage={handleSendMessage}
                    />
                ) : (
                    <Flex
                        direction="column"
                        flex="1"
                        maxW={{ base: "100%", xl: "800px" }}
                        mx="auto"
                        w="100%"
                        transition="all 0.2s"
                    >
                        <MessageList messages={messages} />
                        <ChatInput
                            isEmptyState={false}
                            inputMessage={inputMessage}
                            setInputMessage={setInputMessage}
                            handleSendMessage={handleSendMessage}
                        />
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};

export default Chat;