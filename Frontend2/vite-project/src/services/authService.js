import { createStandaloneToast } from "@chakra-ui/toast";

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
  // Store the access token in localStorage
  localStorage.setItem("googleAccessToken", tokenResponse.access_token);

  // Fetch user profile information
  const userProfile = await fetchUserProfile(tokenResponse.access_token);
  if (userProfile) {
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        name: userProfile.name,
        picture: userProfile.picture,
      })
    );
  }

  toast({
    title: "Success",
    description: "Successfully logged in with Google",
    status: "success",
    duration: 3000,
    isClosable: true,
  });
  navigate("/chat");
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