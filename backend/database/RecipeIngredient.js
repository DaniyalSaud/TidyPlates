import sqlite3 from "sqlite3";

const database = new sqlite3.Database("tidyplates.db");

database.exec(
    `CREATE TABLE IF NOT EXISTS RecipeIngredient (
  recipeID INT NOT NULL,
  ingredientName VARCHAR NOT NULL,
  ingredientQuantity VARCHAR NOT NULL,
  FOREIGN KEY (recipeID) REFERENCES Recipe(recipeID)
);`
);

export const addRecipeIngredient = database.prepare(
    `INSERT INTO RecipeIngredient (recipeID, ingredientName, ingredientQuantity)
    VALUES (?, ?, ?);
    `
);

export const deleteRecipeIngredient = database.prepare(
    `DELETE FROM RecipeIngredient WHERE recipeID = ?;
    `
);