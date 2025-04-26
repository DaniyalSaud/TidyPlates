import sqlite3 from "sqlite3";

// Configure database with busy timeout and journal mode for better concurrency
const database = new sqlite3.Database("tidyplates.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
});

// Set busy timeout to wait when database is locked (5 seconds)
database.configure("busyTimeout", 5000);

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