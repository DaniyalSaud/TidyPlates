import { initStatements } from "./db.js";

// Get the prepared statements
const getStatements = () => {
  const statements = initStatements();
  return statements.recipeIngredient;
};

// Export the functions that use the statements
export const addRecipeIngredient = {
  run: (...args) => getStatements().add.run(...args)
};

export const deleteRecipeIngredient = {
  run: (...args) => getStatements().delete.run(...args)
};