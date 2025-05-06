export const scrollbarStyles = {
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
};
