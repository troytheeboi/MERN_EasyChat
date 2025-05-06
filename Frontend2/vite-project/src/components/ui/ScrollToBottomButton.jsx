import React from "react";
import { IconButton } from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";

const ScrollToBottomButton = ({ onClick }) => (
  <IconButton
    icon={<ChevronDown />}
    position="fixed"
    bottom="100px"
    right="20px"
    colorScheme="blue"
    borderRadius="full"
    onClick={onClick}
    aria-label="Scroll to bottom"
    size="lg"
    boxShadow="lg"
    _hover={{ transform: "scale(1.1)" }}
    transition="all 0.2s"
  />
);

export default ScrollToBottomButton;
