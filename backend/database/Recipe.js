import sqlite3 from "sqlite3";

const database = new sqlite3.Database("tidyplates.db");

database.exex(`
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