import { initStatements } from "./db.js";

// Get the prepared statements
const getStatements = () => {
  const statements = initStatements();
  return statements.user;
};

// Export the functions that use the statements
export const addUser = {
  run: (...args) => getStatements().add.run(...args)
};

export const getUserByID = {
  get: (...args) => getStatements().getById.get(...args),
  all: (...args) => getStatements().getById.all(...args)
};

export const getUserByUsername = {
  get: (...args) => getStatements().getByUsername.get(...args),
  all: (...args) => getStatements().getByUsername.all(...args)
};

export const getUserByEmail = {
  get: (...args) => getStatements().getByEmail.get(...args),
  all: (...args) => getStatements().getByEmail.all(...args)
};

export const getUsers = {
  all: (...args) => getStatements().getAll.all(...args)
};

export const deleteUser = {
  run: (...args) => getStatements().delete.run(...args)
};
