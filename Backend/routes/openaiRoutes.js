import express from "express";
import {
  getOpenAIResponse,
  getConversationsByGoogleId,
} from "../controllers/openaiController.js";

const router = express.Router();

router.post("/chat", getOpenAIResponse);
router.get("/conversations/:googleId", getConversationsByGoogleId);

export default router;
