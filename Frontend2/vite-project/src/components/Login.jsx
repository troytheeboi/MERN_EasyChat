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

const { ToastContainer } = createStandaloneToast();

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("googleAccessToken");
    if (token) {
      navigate("/chat");
    }
  }, [navigate]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => handleLoginSuccess(tokenResponse, navigate),
    onError: handleLoginError,
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
