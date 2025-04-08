import sqlite3 from "sqlite3";

const database = new sqlite3.Database("tidyplates.db");

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
