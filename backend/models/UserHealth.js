import sqlite3 from "sqlite3";

// Configure database with busy timeout and journal mode for better concurrency
const database = new sqlite3.Database("tidyplates.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
});

// Set busy timeout to wait when database is locked (5 seconds)
database.configure("busyTimeout", 5000);

// Creating a simple user table for now, with username, email, and password
database.exec(`
    CREATE TABLE IF NOT EXISTS Health (
  userID INT NOT NULL,
  chronicConditions VARCHAR,
  allergies VARCHAR,
  dietaryRestrictions VARCHAR,
  medications VARCHAR,
  goals VARCHAR,
  FOREIGN KEY (userID) REFERENCES User(userID)
);`);


export const addUserHealthData = database.prepare(`
    INSERT INTO Health (userID, chronicConditions, allergies, dietaryRestrictions, medications, goals)
    VALUES (?, ?, ?, ?, ?, ?);
`);

export const deleteUserHealthDataByID = database.prepare(`
    DELETE FROM Health WHERE userID = ?;
`);


export const getUserHealthDataByID = database.prepare(`
    SELECT * FROM Health WHERE userID = ?;
`);
