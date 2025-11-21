import type { Request, Response } from "express";
import {
  createUserService,
  getUserByIdService,
  getAllUsersService,
  updateUserService,
  deleteUserService,
  userExistsService,
  loginUserService
} from "../services/userService.js";
import { validateUser } from "../validators/userValidator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const { error, value } = validateUser.validate({
    name,
    email,
    password,
    role,
  });
  if (error) {
    return res
      .status(400)
      .json({
        success: false,
        message: error.details?.[0]?.message || "Invalid input",
      });
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
    const user = await createUserService(
      value.name,
      value.email,
      value.password,
      value.role,
      profile
    );

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
    return res
      .status(200)
      .json({ message: "User fetched successfully", data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    return res
      .status(200)
      .json({ message: "Users fetched successfully", data: users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  const { error, value } = validateUser.validate({
    name,
    email,
    password,
    role,
  });
  if (error) {
    return res
      .status(400)
      .json({
        success: false,
        message: error.details?.[0]?.message || "Invalid input",
      });
  }
  const profile = req.file ? req.file.filename : null;

  if (!id) return res.status(400).json({ message: "Id required" });

  try {
    const updatedUser = await updateUserService(
      id,
      name,
      email,
      password,
      role,
      profile
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    return res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
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
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    return res
      .status(200)
      .json({ message: "User deleted successfully", data: deletedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};



//login section

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export const loginUser = async (req: Request, res: Response) =>{
  const {email, password} = req.body;

  try{
    const user = await loginUserService(email);
    if(!user)
      return res.status(401).json({message: "Invalid credentials"});
    const match = await bcrypt.compare(password, user.password);
    if(!match)
      return res.status(401).json({message: "Invalid Credentials"});

    const token = jwt.sign(
      {id: user.id,
        role: user.role},
        JWT_SECRET,
        {
          expiresIn: "1h"
        }
      
    );
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }

  }
