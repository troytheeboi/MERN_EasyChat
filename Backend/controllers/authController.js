import dotenv from "dotenv";
import { OAuth2Client, UserRefreshClient } from "google-auth-library";

dotenv.config();

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

export const handleGoogleAuth = async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code);
    console.log(tokens);
    res.json(tokens);
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
};

export const handleTokenRefresh = async (req, res) => {
  try {
    const user = new UserRefreshClient(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      req.body.refreshToken
    );
    const { credentials } = await user.refreshAccessToken();
    res.json(credentials);
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
};
