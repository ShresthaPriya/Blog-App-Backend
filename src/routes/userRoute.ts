import express from "express";
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  loginUser
} from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

router.post("/register", upload.single("profile"), createUser);
router.post("/login", loginUser);

//protected routes//middleware authenticate
router.get("/", authenticate, getAllUsers);
router.get("/:id", authenticate, getUserById);
router.put("/:id", authenticate, upload.single("profile"), updateUser);
router.delete("/:id", authenticate, deleteUser);

export default router;
