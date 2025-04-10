import sqlite3 from "sqlite3";

const database = new sqlite3.Database("tidyplates.db");

database.exec(`
    CREATE TABLE IF NOT EXISTS Meal (
  mealID INT NOT NULL,
  planID INT NOT NULL,
  mealName VARCHAR NOT NULL,
  mealTime INT NOT NULL,
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