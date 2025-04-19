import React from "react";
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

const { ToastContainer, toast } = createStandaloneToast();

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // Store the access token in localStorage
      localStorage.setItem("googleAccessToken", tokenResponse.access_token);

      toast({
        title: "Success",
        description: "Successfully logged in with Google",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/chat");
    },
    onError: (error) => {
      console.error("Login Failed:", error);

      let errorMessage = "Failed to login with Google";

      // Handle specific error cases
      if (error.error === "popup_closed_by_user") {
        errorMessage = "Login was cancelled";
      } else if (error.error === "access_denied") {
        errorMessage = "Access was denied. Please try again.";
      } else if (error.error === "invalid_request") {
        errorMessage = "Invalid request. Please try again.";
      } else if (error.error === "unauthorized_client") {
        errorMessage = "Unauthorized client. Please contact support.";
      } else if (error.error === "unsupported_response_type") {
        errorMessage = "Unsupported response type. Please try again.";
      } else if (error.error === "server_error") {
        errorMessage = "Server error. Please try again later.";
      } else if (error.error === "temporarily_unavailable") {
        errorMessage =
          "Service temporarily unavailable. Please try again later.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    },
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
                  bg="blue.500"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="md"
                >
                  <Text fontSize="2xl" fontWeight="bold" color="white">
                    MP
                  </Text>
                </Box>
                <Heading size="xl" color="white">
                  My Planner
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
