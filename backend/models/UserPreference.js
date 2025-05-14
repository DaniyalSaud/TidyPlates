import { initStatements } from "./db.js";

// Get the prepared statements
const getStatements = () => {
  const statements = initStatements();
  return statements.preference;
};

// Export the functions that use the statements
export const addUserPreference = {
  run: (...args) => getStatements().add.run(...args)
};

export const getUserPreferenceByID = {
  get: (...args) => getStatements().getById.get(...args),
  all: (...args) => getStatements().getById.all(...args)
};

export const deleteUserPreferenceByID = {
  run: (...args) => getStatements().delete.run(...args)
};