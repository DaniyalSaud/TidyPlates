import { initStatements } from "./db.js";

// Get the prepared statements
const getStatements = () => {
  const statements = initStatements();
  return statements.nutrition;
};

// Export the functions that use the statements
export const addNutritions = {
  run: (...args) => getStatements().add.run(...args)
};

export const deleteNutritions = {
  run: (...args) => getStatements().delete.run(...args)
};
