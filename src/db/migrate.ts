import { readFileSync } from "fs";
import {pool} from "../config/dBConfig.js";

async function runMigrations() {
  const sql = readFileSync("src/db/migrate.sql", "utf-8");
  try {
    await pool.query(sql);
    console.log("Migration completed!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

runMigrations();
