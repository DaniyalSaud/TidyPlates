import sqlite3 from "sqlite3";

// Configure database with busy timeout and journal mode for better concurrency
const database = new sqlite3.Database("tidyplates.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
});

// Set busy timeout to wait when database is locked (5 seconds)
database.configure("busyTimeout", 5000);

database.exec(`
    CREATE TABLE IF NOT EXISTS Recipe (
  recipeID INT NOT NULL,
  mealID INT NOT NULL,
  recipeInstructions VARCHAR NOT NULL,
  PRIMARY KEY (recipeID),
  FOREIGN KEY (mealID) REFERENCES Meal(mealID)
);
`);

export const addRecipe = database.prepare(
    `INSERT INTO Recipe (recipeID, mealID, recipeInstructions)
    VALUES (?, ?, ?);
    `
);

export const deleteRecipe = database.prepare(
    `DELETE FROM Recipe WHERE recipeID = ?;
    `
);