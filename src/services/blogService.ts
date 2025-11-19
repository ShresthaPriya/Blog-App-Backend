import { pool } from "../config/dBConfig.js";
import { slugify } from "../utils/slugify.js";
import { v4 as uuidv4 } from "uuid";
import {getPage} from "../utils/pagination.js"

export const createBlog = async (
  title: string,
  description: string,
  author_id: number,
  image?: string | null
) => {
    
  const slug_id = uuidv4().substring(0, 8);
  const slug = `${slugify(title)}-${slug_id}`;

  const result = await pool.query(
    `INSERT INTO blog (title, description, image, slug, author_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, description, image || null, slug, author_id]
  );
  return result.rows[0];
};




export const getBlog = async (id: number) => {
  const result = await pool.query(
    `SELECT b.*, u.name AS author_name, u.profile AS author_profile
     FROM blog b
     JOIN "user" u ON b.author_id = u.id
     WHERE b.id=$1`,
    [id]
  );
  return result.rows[0];
};

export const getBlogBySlug = async (slug: string) => {
  const result = await pool.query(
    `SELECT b.*, u.name AS author_name, u.profile AS author_profile
     FROM blog b
     JOIN "user" u ON b.author_id = u.id
     WHERE b.slug=$1`,
    [slug]
  );
  return result.rows[0];
};


export const getAllBlogs = async (page?: number, limit?: number, search?:string) => {
  const { page: _page, limit: _limit, offset } = getPage({ page: page || 1, limit: limit || 5 });
  const searchQuery = search ? `%${search}%` : '%';
  const result = await pool.query(
    `SELECT b.*, u.name AS author_name, u.profile AS author_profile
     FROM blog b
     JOIN "user" u ON b.author_id = u.id
     WHERE (title ILIKE $3 OR description ILIKE $3)
     ORDER BY b.id DESC
     LIMIT $1 OFFSET $2`,
    [_limit, offset, searchQuery]
  );

  // Count total blogs
   const countResult = await pool.query(
    `SELECT COUNT(*) AS total
     FROM blog b
     WHERE b.title ILIKE $1 OR b.description ILIKE $1`,
    [searchQuery]
  );
  const totalItems = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(totalItems / _limit);

  return {
    rows: result.rows,
    totalItems,
    totalPages,
    currentPage: _page,
  };
};


export const getBlogsByAuthor = async (author_id: number) => {
  const result = await pool.query(
    `SELECT b.*, u.name AS author_name, u.profile AS author_profile
     FROM blog b
     JOIN "user" u ON b.author_id = u.id
     WHERE b.author_id=$1
     ORDER BY b.created_at DESC`,
    [author_id]
  );
  return result.rows;
};

// Update blog with optional image
export const updateBlog = async (
  id: number,
  title?: string,
  description?: string,
  auther_id?: Number,
  image?: string | null
) => {
  const slug_id = uuidv4().substring(0, 8);
  const slug = title ? `${slugify(title)}-${slug_id}` : undefined;

  const result = await pool.query(
    `UPDATE blog
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         slug = COALESCE($3, slug),
         image = COALESCE($4, image),
         author_id = COALESE($5, author_id)
     WHERE id = $6
     RETURNING *`,
    [title, description, slug, image, auther_id, id]
  );
  return result.rows[0];
};

// Delete blog
export const deleteBlog = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM blog
     WHERE id=$1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
};
