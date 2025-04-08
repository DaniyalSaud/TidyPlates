import sqlite3 from "sqlite3";

const database = new sqlite3.Database("tidyplates.db");

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
