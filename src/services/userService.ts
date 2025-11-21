import { pool } from "../config/dBConfig.js";
import bcrypt from "bcrypt";
// Create a new user
export const createUserService = async (
  name: string,
  email: string,
  password: string,
  role: string,
  profile: string | null
) => {
  const hashed_password = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO "user" (name, email, password, role, profile) VALUES ($1, $2,$3, $4, $5) RETURNING *`,
    [name, email, hashed_password, role, profile]
  );
  return result.rows[0];
};

export const userExistsService = async (name: string) => {
  const result = await pool.query(`SELECT * FROM "user" WHERE name= $1 `, [
    name,
  ]);
  return result.rows[0] || null;
};

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
export const updateUserService = async (
  id: string,
  name: string,
  email: string,
  password: string,
  role: string,
  profile: string | null
) => {
  const result = await pool.query(
    `UPDATE "user"
     SET name=$1, email=$2, password=$3, role=$4, profile=$5
     WHERE id=$6 
     RETURNING *`,
    [name, email, password, role, profile, id]
  );

  return result.rows[0];
};

// Delete user
export const deleteUserService = async (id: string) => {
  const result = await pool.query(
    `UPDATE "user" SET deleted_at = NOW()
    WHERE id=$1
    RETURNING *`,
    [id]
  );
  return result.rows[0];
};


export const loginUserService = async (email: string) =>{
  const result = await pool.query(
    `SELECT * FROM "user" WHERE email=$1`,
    [email]
  );

  const user = result.rows[0];
  if(!user){
    return null;
  }else{
    return user;
  }
}
