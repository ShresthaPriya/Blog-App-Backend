import type { Request, Response } from "express";
import {
  createBlog,
  getBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  getBlogBySlug,
  getBlogsByAuthor,

} from "../services/blogService.js";

import { pool } from "../config/dBConfig.js";

import { validateBlog , validateSearch} from "../validators/blogValidator.js";

// Create Blog
export const CreateBlog = async (req: Request, res: Response) => {
  const { title, description, author_id } = req.body;
  const {error} = validateBlog.validate({title, description, author_id});
 if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details?.[0]?.message});
  }
  const image = req.file ? req.file.filename : null;



  try {
    const blog = await createBlog(title, description, Number(author_id), image);
    return res.status(201).json({ message: "Blog created successfully", data: blog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get blog by ID
export const getBlogById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: "Id required" });

  try {
    const blog = await getBlog(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    return res.status(200).json({ message: "Blog fetched successfully", data: blog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get blog by slug
export const getBlogUsingSlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!slug) return res.status(400).json({ message: "Slug required" });

  try {
    const blog = await getBlogBySlug(slug);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    return res.status(200).json({ message: "Blog fetched successfully", data: blog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all blogs
export const getAllBlogPosts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const search = String(req.query.search || "");

  const { error } = validateSearch.validate({ search });
  if (error) {
    return res.status(400).json({ success: false, message: error.details?.[0]?.message });
  }

  try {
    const blogs = await getAllBlogs(page, limit, search);
    return res.status(200).json({ success: true, message: "Blogs fetched successfully", data: blogs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// Get blogs by author
export const getBlogsForAuthor = async (req: Request, res: Response) => {
  const author_id = Number(req.params.author_id);
  if (!author_id) return res.status(400).json({ message: "Author ID required" });

  try {
    const blogs = await getBlogsByAuthor(author_id);
    return res.status(200).json({ message: "Blogs fetched successfully", data: blogs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update blog
export const updateBlogPost = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, description, author_id } = req.body;
  const image = req.file ? req.file.filename : null;
  const {error} = validateBlog.validate({title, description, author_id});

  if(error){
    return res
      .status(400)
      .json({ success: false, message: error.details?.[0]?.message});
  }

  if (!id) return res.status(400).json({ message: "Id not found." });

  try {
    const updatedBlog = await updateBlog(id, title, description, author_id, image);
    if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });

    return res.status(200).json({ message: "Blog updated successfully", data: updatedBlog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete blog
export const deleteBlogPost = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const checkBlog = await pool.query(
      `SELECT * FROM blog WHERE id=$1 AND is_deleted = FALSE`,
      [id]
    );
    if(checkBlog.rows.length === 0){
      return res.status(404).json({message:"Blog not found"});
    }
    const deletedBlog = await deleteBlog(id);
    return res.status(200).json({ message: "Blog deleted successfully", data: deletedBlog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
