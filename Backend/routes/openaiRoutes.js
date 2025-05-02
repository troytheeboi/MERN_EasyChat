import express from "express";
import { getOpenAIResponse } from "../controllers/openaiController.js";

const router = express.Router();

router.post("/chat", getOpenAIResponse);

export default router;
