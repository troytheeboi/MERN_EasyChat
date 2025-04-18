import React from 'react';
import {
    Box,
    Button,
    Center,
    Heading,
    VStack,
    useToast,
    Text,
    Image,
    Container,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const toast = useToast();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            // TODO: Implement Google OAuth
            toast({
                title: 'Success',
                description: 'Successfully logged in with Google',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate('/chat');
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to login with Google',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
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
                            <Heading size="xl" color="white">My Planner</Heading>
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
                            onClick={handleGoogleLogin}
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                                bg: 'blue.400'
                            }}
                            transition="all 0.2s"
                        >
                            Continue with Google
                        </Button>

                        {/* Footer Text */}
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                            By continuing, you agree to our Terms of Service and Privacy Policy
                        </Text>
                    </VStack>
                </Box>
            </Container>
        </Center>
    );
};

export default Login; 