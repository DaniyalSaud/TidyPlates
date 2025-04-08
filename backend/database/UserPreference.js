import sqlite3 from "sqlite3";

const database = new sqlite3.Database("tidyplates.db");

// Creating a simple user table for now, with username, email, and password
database.exec(`
    CREATE TABLE IF NOT EXISTS Preferences (
  userID INT NOT NULL,
  cuisinePref VARCHAR,
  avoid VARCHAR,
  mealTypePref VARCHAR,
  cookTimePref INT,
  prefIngredients VARCHAR,
  mealFreq INT NOT NULL,
  mealTimings INT NOT NULL,
  FOREIGN KEY (userID) REFERENCES User(userID)
);`);

export const addUserPreference = database.prepare("INSERT INTO Preferences(userID, cuisinePref, avoid, mealTypePref, cookTimePref, prefIngredients, mealFreq, mealTimings) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

export const getUserPreferenceByID= database.prepare("SELECT * FROM Preferences WHERE userID = ?");

export const deleteUserPreferenceByID = database.prepare("DELETE FROM Preferences WHERE userID = ?");