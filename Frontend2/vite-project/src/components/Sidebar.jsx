import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Avatar,
  IconButton,
  Heading,
  InputGroup,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  InputLeftElement,
  Spinner,
} from "@chakra-ui/react";
import {
  FaPaperPlane,
  FaSignOutAlt,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { PanelLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleSignOut } from "../services/authService";

const Sidebar = ({
  onClose,
  isOpen,
  variant,
  startNewChat,
  groupedChats,
  currentSession,
  loadChatSession,
  isSidebarVisible,
  toggleSidebar,
  searchQuery,
  setSearchQuery,
  currentPage,
  totalPages,
  hasMore,
  onPageChange,
  isLoading,
}) => {
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, hasMore, isLoading, onPageChange]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleSignOutClick = () => {
    handleSignOut(navigate);
  };

  const handleEditTitle = (sessionId) => {
    console.log("Edit title for session:", sessionId);
  };

  const handleDeleteChat = (sessionId) => {
    console.log("Delete chat session:", sessionId);
  };

  const CollapsedSidebar = () => (
    <VStack
      w="60px"
      bg="gray.800"
      borderRight="1px"
      borderColor="gray.700"
      p={2}
      h="100vh"
      spacing={4}
      justify="space-between"
    >
      <VStack spacing={4}>
        <IconButton
          icon={<PanelLeft size={20} />}
          onClick={toggleSidebar}
          variant="ghost"
          colorScheme="whiteAlpha"
          aria-label="Show sidebar"
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
        />
        <IconButton
          icon={<FaPlus />}
          onClick={startNewChat}
          colorScheme="blue"
          aria-label="New chat"
          size="sm"
        />
      </VStack>

      <Box pt={4} w="100%">
        <IconButton
          icon={
            <Avatar
              size="sm"
              src={userProfile?.picture}
              name={userProfile?.name || "User"}
            />
          }
          variant="ghost"
          w="100%"
          h="40px"
          p={0}
          onClick={handleSignOutClick}
          _hover={{ bg: "whiteAlpha.200" }}
          aria-label="User profile and sign out"
        />
      </Box>
    </VStack>
  );

  const SidebarContent = (
    <VStack h="100%" spacing={4} align="stretch" px={2} pb={4} pt={4}>
      <HStack justify="space-between" w="100%" mb={2}>
        <Heading size="md" color="white">
          Easy Chat
        </Heading>
        <IconButton
          icon={<PanelLeft size={20} />}
          onClick={toggleSidebar}
          variant="ghost"
          colorScheme="whiteAlpha"
          aria-label="Hide sidebar"
          color="white"
          transform="rotate(180deg)"
          _hover={{ bg: "whiteAlpha.200" }}
        />
      </HStack>

      <Button
        leftIcon={<FaPlus />}
        colorScheme="blue"
        size="md"
        w="100%"
        onClick={() => {
          startNewChat();
          if (variant === "drawer") onClose();
        }}
        mt={2}
      >
        New Chat
      </Button>

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <FaSearch color="gray.500" />
        </InputLeftElement>
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg="gray.700"
          borderColor="transparent"
          _placeholder={{ color: "gray.500" }}
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
            color: "white",
          }}
          _hover={{
            borderColor: "gray.600",
            color: "white",
          }}
          color="white"
        />
      </InputGroup>

      <VStack
        ref={scrollContainerRef}
        spacing={1}
        align="stretch"
        overflowY="auto"
        flex="1"
        w="100%"
        sx={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.700",
            borderRadius: "24px",
          },
        }}
      >
        {Object.entries(groupedChats).map(([group, sessions]) => (
          <Box key={group}>
            <Text
              fontSize="xs"
              color="blue.300"
              fontWeight="medium"
              mb={2}
              mt={2}
              px={2}
            >
              {group}
            </Text>
            {sessions.map((session) => (
              <Box
                key={session.id}
                p={2}
                borderRadius="md"
                bg={
                  currentSession?.id === session.id ? "blue.900" : "transparent"
                }
                cursor="pointer"
                onClick={() => {
                  loadChatSession(session);
                  if (variant === "drawer") onClose();
                }}
                onMouseEnter={() => setHoveredChatId(session.id)}
                onMouseLeave={() => setHoveredChatId(null)}
                _hover={{ bg: "gray.700" }}
                position="relative"
                mb={2}
                {...(hoveredChatId === session.id && { p: 3 })}
              >
                <Text
                  fontSize="sm"
                  color="gray.300"
                  noOfLines={1}
                  fontWeight={
                    currentSession?.id === session.id ? "bold" : "normal"
                  }
                >
                  {session.title}
                </Text>

                {hoveredChatId === session.id && (
                  <Box mt={1}>
                    <Text fontSize="xs" color="gray.400" noOfLines={2} mb={8}>
                      {session.summary || "No summary available"}
                    </Text>
                    <HStack
                      spacing={2}
                      position="absolute"
                      right={2}
                      bottom={2}
                      bg="gray.800"
                      p={1}
                      borderRadius="md"
                      onMouseEnter={() => setHoveredChatId(session.id)}
                    >
                      <IconButton
                        icon={<FaEdit />}
                        size="xs"
                        variant="ghost"
                        colorScheme="gray"
                        aria-label="Edit title"
                        color="gray.300"
                        _hover={{ bg: "gray.700", color: "white" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTitle(session.id);
                        }}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        aria-label="Delete chat"
                        color="gray.300"
                        _hover={{ bg: "gray.700", color: "red.300" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChat(session.id);
                        }}
                      />
                    </HStack>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        ))}

        {isLoading && (
          <Box py={4} textAlign="center">
            <Spinner size="sm" color="blue.500" />
          </Box>
        )}
      </VStack>

      <Box pt={4} borderTop="1px" borderColor="gray.700" w="100%">
        <HStack spacing={3} justify="space-between">
          <HStack flex="1">
            <Avatar
              size="md"
              src={userProfile?.picture}
              name={userProfile?.name || "User"}
            />
            <Text fontSize="md" color="gray.300" noOfLines={1}>
              {userProfile?.name || "User"}
            </Text>
          </HStack>
          <IconButton
            icon={<FaSignOutAlt />}
            variant="ghost"
            colorScheme="whiteAlpha"
            size="md"
            onClick={handleSignOutClick}
            aria-label="Sign out"
            color="white"
            _hover={{ color: "red.400", bg: "whiteAlpha.200" }}
          />
        </HStack>
      </Box>
    </VStack>
  );

  return (
    <>
      {variant === "drawer" ? (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerContent bg="#1A202C" color="white">
            <DrawerHeader>Easy Chat</DrawerHeader>
            <DrawerBody>{SidebarContent}</DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : isSidebarVisible ? (
        <Box bg="#1A202C" h="100vh" w="280px" px={2}>
          {SidebarContent}
        </Box>
      ) : (
        <CollapsedSidebar />
      )}
    </>
  );
};

export default Sidebar;
