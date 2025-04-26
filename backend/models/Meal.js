import sqlite3 from "sqlite3";

// Configure database with busy timeout and journal mode for better concurrency
const database = new sqlite3.Database("tidyplates.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
});

// Set busy timeout to wait when database is locked (5 seconds)
database.configure("busyTimeout", 5000);

database.exec(`
    CREATE TABLE IF NOT EXISTS Meal (
  mealID INT NOT NULL,
  planID INT NOT NULL,
  mealName VARCHAR NOT NULL,
  mealTime VARCHAR NOT NULL,
  mealTags VARCHAR,
  mealPicture VARCHAR,
  PRIMARY KEY (mealID),
  FOREIGN KEY (planID) REFERENCES MealPlan(planID)
);
`);

export const addMeal = database.prepare(
    `INSERT INTO Meal (mealID, planID, mealName, mealTime, mealTags, mealPicture)
    VALUES (?, ?, ?, ?, ?, ?);
    `
);

export const deleteMeal = database.prepare(
    `DELETE FROM Meal WHERE mealID = ?;
    `
);

export const getMeal = database.prepare(
    `SELECT * FROM Meal WHERE planID = ?;
    `
);

export const deleteAllMealsByUserID = database.prepare(
    `DELETE FROM Meal WHERE planID IN (SELECT planID FROM MealPlan WHERE userID = ?);
    `
);

export const getAllMealsByPlanID = database.prepare(
    `SELECT * FROM Meal WHERE planID = ?;
    `
);