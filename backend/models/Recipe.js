import { initStatements } from "./db.js";

// Get the prepared statements
const getStatements = () => {
  const statements = initStatements();
  return statements.recipe;
};

// Export the functions that use the statements
export const addRecipe = {
  run: (...args) => getStatements().add.run(...args)
};

export const deleteRecipe = {
  run: (...args) => getStatements().delete.run(...args)
};