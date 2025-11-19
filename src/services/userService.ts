import { pool } from "../config/dBConfig.js";

// Create a new user
export const createUserService = async (name: string, profile: string | null) => {
  const result = await pool.query(
    `INSERT INTO "user" (name, profile) VALUES ($1, $2) RETURNING *`,
    [name, profile]
  );
  return result.rows[0];
};

export const userExistsService = async(name:string)=>{
  const result = await pool.query(`SELECT * FROM "user" WHERE name= $1 `, [name]);
  return result.rows[0] || null; 
} 

// Get user by ID
export const getUserByIdService = async (id: string) => {
  const result = await pool.query(`SELECT * FROM "user" WHERE id=$1`, [id]);
  return result.rows[0];
};

// Get all users
export const getAllUsersService = async () => {
  const result = await pool.query(`SELECT * FROM "user" ORDER BY id`);
  return result.rows;
};

// Update user (optional profile image)
export const updateUserService = async (id: string, name: string, profile: string | null) => {
  const result = await pool.query(
    `UPDATE "user" SET name=$1, profile=$2 WHERE id=$3 RETURNING *`,
    [name, profile, id]
  );
  return result.rows[0];
};

// Delete user
export const deleteUserService = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM "user" WHERE id=$1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};
