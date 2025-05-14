import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.join(__dirname, '..', 'tidyplates.db');

// Configure database with busy timeout and journal mode for better concurrency
const database = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Database connection error:", err.message);
  console.log(`Connected to SQLite database at ${dbPath}`);
});

// Set busy timeout to wait when database is locked (5 seconds)
database.configure("busyTimeout", 5000);

// Use WAL (Write-Ahead Logging) for better concurrency
database.exec("PRAGMA journal_mode = WAL;");

export { database };