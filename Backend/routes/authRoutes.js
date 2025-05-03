import express from "express";

import {
  handleGoogleAuth,
  handleTokenRefresh,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/google", handleGoogleAuth);
router.post("/refresh-token", handleTokenRefresh);

export default router;
