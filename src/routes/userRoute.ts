import express from "express";
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Create user
router.post("/", upload.single("profile"), createUser);

// Get all users
router.get("/", getAllUsers);

// Get single user
router.get("/:id", getUserById);

// Update user
router.put("/:id", upload.single("profile"), updateUser);

// Delete user
router.delete("/:id", deleteUser);

export default router;
