import express from "express";
import {
  createBlog,
  getBlogById,
  getBlogUsingSlug,
  getAllBlogPosts,
  getBlogsForAuthor,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blogController.js";
import {authorize} from "../middleware/authorization.js";
import {authenticate} from "../middleware/authentication.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();


router.post("/", authenticate, authorize("author"), upload.single("image"), createBlog);
router.get("/", getAllBlogPosts);
router.get("/id/:id", getBlogById);
router.get("/slug/:slug", getBlogUsingSlug);
router.get("/author/:author_id", getBlogsForAuthor);
router.put("/:id", authenticate, authorize("author") ,upload.single("image"), updateBlogPost);
router.delete("/:id",authenticate, authorize("author"), deleteBlogPost);

export default router;
