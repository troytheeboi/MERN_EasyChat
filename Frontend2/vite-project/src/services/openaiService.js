import { API_BASE_URL } from "../config/config";

export const sendMessage = async (
  prompt,
  conversationId = null,
  onStream = null
) => {
  try {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (!userProfile?.googleId) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/api/openai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        conversationId,
        googleId: userProfile.googleId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response from OpenAI");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";
    let metadata = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6));

          if (data.done) {
            metadata = data;
          } else if (data.content) {
            fullResponse += data.content;
            if (onStream) {
              onStream(fullResponse);
            }
          }
        }
      }
    }

    return {
      response: fullResponse,
      ...metadata,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getConversations = async (page = 1) => {
  try {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (!userProfile?.googleId) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/openai/conversations/${userProfile.googleId}?page=${page}&limit=12`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get conversations");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting conversations:", error);
    throw error;
  }
};
