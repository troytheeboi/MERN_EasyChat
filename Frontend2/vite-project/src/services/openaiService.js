import { API_BASE_URL } from "../config/config";


export const sendMessage = async (prompt, conversationId = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/openai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        conversationId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response from OpenAI");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
