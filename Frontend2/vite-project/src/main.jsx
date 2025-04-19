import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  components: {
    Drawer: {
      baseStyle: {
        dialog: {
          maxW: "400px",
          padding: "0 20px",
        },
      },
    },
    Panel: {
      baseStyle: {
        container: {
          bg: "gray.100",
          _hover: {
            bg: "gray.200",
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={"139648417797-l50rt1vj6fd2vhrufsahlvh9gd3u4lpe.apps.googleusercontent.com"}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
