import { createStandaloneToast } from "@chakra-ui/toast";
import { API_BASE_URL } from '../config/config';

const { toast } = createStandaloneToast();

export const fetchUserProfile = async (accessToken) => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const handleLoginSuccess = async (tokenResponse, navigate) => {
  try {
    // Store the access token in localStorage
    localStorage.setItem("googleAccessToken", tokenResponse.access_token);

    // Fetch user profile information
    const userProfile = await fetchUserProfile(tokenResponse.access_token);
    if (!userProfile) {
      throw new Error("Failed to fetch user profile");
    }

    // Prepare user data
    const userData = {
      googleId: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      profilePhoto: userProfile.picture,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token
    };

    // Check if user exists in our database
    const response = await fetch(`${API_BASE_URL}/api/users/google/${userProfile.id}`);
    
    if (response.status === 404) {
      // User doesn't exist, create new user
      const createResponse = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create user');
      }
    } else if (!response.ok) {
      throw new Error('Failed to check user existence');
    }

    // Store user profile in localStorage
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        name: userProfile.name,
        picture: userProfile.picture,
        email: userProfile.email,
        googleId: userProfile.id
      })
    );

    toast({
      title: "Success",
      description: "Successfully logged in with Google",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/chat");
  } catch (error) {
    console.error("Login Error:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to complete login process",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};

export const handleLoginError = (error) => {
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
    errorMessage = "Service temporarily unavailable. Please try again later.";
  }

  toast({
    title: "Error",
    description: errorMessage,
    status: "error",
    duration: 5000,
    isClosable: true,
    position: "top",
  });
};

export const handleSignOut = async (navigate) => {
  try {
    // Clear local storage
    localStorage.removeItem("googleAccessToken");
    localStorage.removeItem("chatSessions");
    localStorage.removeItem("userProfile");

    // Revoke Google access token
    const token = localStorage.getItem("googleAccessToken");
    if (token) {
      await fetch("https://oauth2.googleapis.com/revoke?token=" + token, {
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
      });
    }

    toast({
      title: "Success",
      description: "Successfully signed out",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    navigate("/login");
  } catch (error) {
    console.error("Error signing out:", error);
    toast({
      title: "Error",
      description: "Failed to sign out. Please try again.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    // Still navigate to login even if token revocation fails
    navigate("/login");
  }
}; 