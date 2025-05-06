import React, { useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  VStack,
  Text,
  Container,
} from "@chakra-ui/react";
import { createStandaloneToast } from "@chakra-ui/toast";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { handleLoginSuccess, handleLoginError } from "../services/authService";
import axios from "axios";

const { ToastContainer } = createStandaloneToast();

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("googleAccessToken");
    if (token) {
      navigate("/chat");
    }
  }, [navigate]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        const tokens = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
          {
            code,
          }
        );
        handleLoginSuccess(tokens.data, navigate);
      } catch (error) {
        console.error("Google OAuth error:", error);
        handleLoginError(error);
      }
    },
    onError: handleLoginError,
    flow: "auth-code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
  });

  return (
    <>
      <ToastContainer />
      <Center h="100vh" bg="gray.900">
        <Container maxW="container.sm">
          <Box
            p={8}
            borderWidth={1}
            borderRadius={12}
            boxShadow="xl"
            bg="gray.800"
            borderColor="gray.700"
          >
            <VStack spacing={6}>
              {/* Logo and App Name */}
              <VStack spacing={2}>
                <Box
                  w="80px"
                  h="80px"
                  borderRadius="full"
                  bg="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="md"
                  overflow="hidden"
                >
                  <img
                    src="/easy_chat_logo.png"
                    alt="Easy Chat Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Heading size="xl" color="white">
                  Easy Chat
                </Heading>
              </VStack>

              {/* Tagline */}
              <Text fontSize="lg" color="gray.400" textAlign="center">
                Your AI-powered chat companion
              </Text>

              {/* Login Button */}
              <Button
                leftIcon={<FcGoogle />}
                colorScheme="blue"
                size="lg"
                width="100%"
                onClick={() => handleGoogleLogin()}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                  bg: "blue.400",
                }}
                transition="all 0.2s"
              >
                Continue with Google
              </Button>

              {/* Footer Text */}
              <Text fontSize="sm" color="gray.500" textAlign="center">
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </Text>
            </VStack>
          </Box>
        </Container>
      </Center>
    </>
  );
};

export default Login;
