import type { Request, Response } from "express";
import {
  createUserService,
  getUserByIdService,
  getAllUsersService,
  updateUserService,
  deleteUserService,
  userExistsService,

} from "../services/userService.js";
import { validateUser } from "../validators/userValidator.js";


export const createUser = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { error, value } = validateUser.validate({ name });
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details?.[0]?.message || "Invalid input" });
  }

  //check if user exist by name for now
  try {
    const existingUser = await userExistsService(value.name);
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const profile = req.file ? req.file.filename : null;
    const user = await createUserService(value.name, profile);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};



// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Id required" });

  try {
    const user = await getUserByIdService(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User fetched successfully", data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    return res.status(200).json({ message: "Users fetched successfully", data: users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update user (optional image)
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const profile = req.file ? req.file.filename : null;

  if (!id) return res.status(400).json({ message: "Id required" });

  try {
    const updatedUser = await updateUserService(id, name, profile);
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User updated successfully", data: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Id required" });

  try {
    const deletedUser = await deleteUserService(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User deleted successfully", data: deletedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
