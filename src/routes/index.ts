import express from "express";
import blogRoutes from "./blogRoutes.js";
import userRoutes from "./userRoute.js";

const router = express.Router();
router.use("/blog", blogRoutes);
router.use("/user", userRoutes);

export default router;