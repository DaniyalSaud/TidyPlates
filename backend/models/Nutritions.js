import sqlite3 from "sqlite3";

// Configure database with busy timeout and journal mode for better concurrency
const database = new sqlite3.Database("tidyplates.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
});

// Set busy timeout to wait when database is locked (5 seconds)
database.configure("busyTimeout", 5000);

database.exec(
    `CREATE TABLE IF NOT EXISTS Nutritions (
  mealID INT NOT NULL,
  calories INT NOT NULL,
  protein INT NOT NULL,
  carbs INT NOT NULL,
  fats INT NOT NULL,
  FOREIGN KEY (mealID) REFERENCES Meal(mealID)
);`
);

export const addNutritions = database.prepare(
    `INSERT INTO Nutritions (mealID, calories, protein, carbs, fats)
    VALUES (?, ?, ?, ?, ?);
    `
);

export const deleteNutritions = database.prepare(
    `DELETE FROM Nutritions WHERE mealID = ?;
    `
);
