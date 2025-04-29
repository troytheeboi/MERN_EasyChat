import express from "express";
import {
  createUser,
  getUsers,
  deleteUser,
  getGoogleUser,
  updateGoogleUser,
} from "../controllers/userController.js";

const router = express.Router();

// User routes
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:googleId", getGoogleUser);
router.put("/:googleId", updateGoogleUser);
router.delete("/:googleId", deleteUser);

export default router;
