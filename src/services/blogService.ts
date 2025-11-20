import { pool } from "../config/dBConfig.js";
import { slugify } from "../utils/slugify.js";
import { v4 as uuidv4 } from "uuid";
import { getPage } from "../utils/pagination.js";

export const createBlogService = async (
  title: string,
  description: string,
  author_id: number,
  image?: string | null,
  is_featured: boolean = false
) => {
  const slug_id = uuidv4().substring(0, 8); //generates unique identifier and takes first 8 charracters
  const slug = `${slugify(title)}-${slug_id}`; //Combines the slugified title and the short UUID with a dash

  const result = await pool.query(
    `INSERT INTO blog (title, description, image, slug, author_id, is_featured)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, description, image || null, slug, author_id, is_featured]
  );
  return result.rows[0];
};

export const getBlog = async (id: number) => {
  const result = await pool.query(
    `SELECT b.*, u.name AS author_name, u.profile AS author_profile
     FROM blog b
     JOIN "user" u ON b.author_id = u.id
     WHERE b.id=$1 AND b.b.deleted_at IS NULL AND b.is_featured = FALSE`,
    [id]
  );
  return result.rows[0];
};



//Get Blog BY Slug
export const getBlogBySlug = async (slug: string) => {
  const result = await pool.query(
    `SELECT b.*, u.name AS author_name, u.profile AS author_profile
     FROM blog b
     JOIN "user" u ON b.author_id = u.id
     WHERE b.slug=$1 AND b.deleted_at IS NULL`,
    [slug]
  );
  return result.rows[0];
};

//ALL BLOGS
export const getAllBlogs = async (
  page?: number,
  limit?: number,
  search?: string,
  is_featured?: boolean
) => {
  const { page: _page, limit: _limit, offset } = getPage({
    page: page || 1,
    limit: limit || 5,
  });

  const searchQuery = search ? `%${search}%` : "%";

  let query = `
    SELECT b.*, u.name AS author_name, u.profile AS author_profile
    FROM blog b
    JOIN "user" u ON b.author_id = u.id
    WHERE (b.title ILIKE $1 OR b.description ILIKE $1)
      AND b.deleted_at IS NULL
  `;

  let countQuery = `
    SELECT COUNT(*) AS total
    FROM blog b
    WHERE (b.title ILIKE $1 OR b.description ILIKE $1)
      AND b.deleted_at IS NULL
  `;

  const values: any[] = [searchQuery];

  if (typeof is_featured === "boolean") {
  if (is_featured) {
    query += ` AND b.is_featured = TRUE`;
    countQuery += ` AND b.is_featured = TRUE`;
  } else {
    query += ` AND b.is_featured = FALSE`;
    countQuery += ` AND b.is_featured = FALSE`;
  }
}


  query += ` ORDER BY b.id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(_limit, offset);

  const result = await pool.query(query, values);
  const countResult = await pool.query(countQuery, values.slice(0, values.length - 2));

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
     WHERE b.author_id=$1 AND b.deleted_at IS NULL
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
  author_id?: number,
  image?: string | null,
  is_featured: boolean = false
) => {
  const slug_id = uuidv4().substring(0, 8);
  const slug = title ? `${slugify(title)}-${slug_id}` : undefined;

  const result = await pool.query(
    `UPDATE blog
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         slug = COALESCE($3, slug),
         image = COALESCE($4, image),
         author_id = COALESCE($5, author_id),
         is_featured = COALESCE($6, is_featured)
     WHERE id = $7 AND deleted_at IS NULL
     RETURNING *`,
    [title, description, slug, image, author_id, is_featured, id]
  );
  return result.rows[0];
};

// Delete blog
export const deleteBlog = async (id: number) => {
  const result = await pool.query(
    `UPDATE blog SET deleted_at = NOW() 
     WHERE id=$1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
};
