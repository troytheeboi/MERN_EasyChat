import { useRef, useEffect, useState } from "react";

export const useScrollToBottom = () => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const lastContentRef = useRef("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleMessagesUpdate = (messages) => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    const isStreamingMessage =
      lastMessage.sender === "assistant" &&
      lastMessage.content !== lastContentRef.current;

    setIsStreaming(isStreamingMessage);
    lastContentRef.current = lastMessage.content;

    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (isNearBottom) {
        scrollToBottom();
      }
    }
  };

  return {
    messagesEndRef,
    containerRef,
    showScrollButton,
    isStreaming,
    scrollToBottom,
    handleMessagesUpdate,
  };
};
