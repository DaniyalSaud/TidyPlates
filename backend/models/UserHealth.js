import { initStatements } from "./db.js";

// Get the prepared statements
const getStatements = () => {
  const statements = initStatements();
  return statements.health;
};

// Export the functions that use the statements
export const addUserHealthData = {
  run: (...args) => getStatements().add.run(...args)
};

export const deleteUserHealthDataByID = {
  run: (...args) => getStatements().delete.run(...args)
};

export const getUserHealthDataByID = {
  get: (...args) => getStatements().getById.get(...args),
  all: (...args) => getStatements().getById.all(...args)
};
