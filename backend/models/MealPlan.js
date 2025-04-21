import sqlite3 from "sqlite3";

const database = new sqlite3.Database("tidyplates.db");

database.exec(
    `CREATE TABLE IF NOT EXISTS MealPlan (
  planID INT NOT NULL,
  userID INT NOT NULL,
  PRIMARY KEY (planID),
  FOREIGN KEY (userID) REFERENCES User(userID)
);
    `
);

export const addMealPlan = database.prepare(
    `INSERT INTO MealPlan (planID, userID)
    VALUES (?, ?);
    `
);

export const deleteMealPlan = database.prepare(
    `DELETE FROM MealPlan WHERE planID = ?;
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
