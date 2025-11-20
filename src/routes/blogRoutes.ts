import express from "express";
import {
  CreateBlog,
  getBlogById,
  getBlogUsingSlug,
  getAllBlogPosts,
  getBlogsForAuthor,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blogController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();


router.post("/", upload.single("image"), CreateBlog);
router.get("/", getAllBlogPosts);
router.get("/id/:id", getBlogById);
router.get("/slug/:slug", getBlogUsingSlug);
router.get("/author/:author_id", getBlogsForAuthor);
router.put("/:slug", upload.single("image"), updateBlogPost);
router.delete("/:id", deleteBlogPost);

export default router;
