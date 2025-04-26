import sqlite3 from "sqlite3";

// Configure database with busy timeout and journal mode for better concurrency
const database = new sqlite3.Database("tidyplates.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
});

// Set busy timeout to wait when database is locked (5 seconds)
database.configure("busyTimeout", 5000);

database.exec(
    `CREATE TABLE IF NOT EXISTS MealPlan (
  planID INT NOT NULL,
  userID INT NOT NULL,
  planDate VARCHAR,
  PRIMARY KEY (planID),
  FOREIGN KEY (userID) REFERENCES User(userID)
);
    `
);

export const addMealPlan = database.prepare(
    `INSERT INTO MealPlan (planID, userID, planDate)
    VALUES (?, ?, ?);
    `
);

export const deleteMealPlan = database.prepare(
    `DELETE FROM MealPlan WHERE planID = ?;
    `
);

export const deleteAllMealPlans = database.prepare(
    `DELETE FROM MealPlan WHERE userID = ?;
    `
);

export const getAllMealPlansByID = database.prepare(
    `SELECT * FROM MealPlan WHERE userID = ?;
    `
);

export const getMealPlanCount = database.prepare(
    `SELECT COUNT(*) AS TOTAL_PLANS FROM MealPlan;
    `
);
