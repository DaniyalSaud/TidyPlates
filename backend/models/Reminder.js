import { initStatements } from "./db.js";

// Get the prepared statements
const getStatements = () => {
  const statements = initStatements();
  return statements.reminder;
};

// Export the functions that use the statements
export const addReminder = {
  run: (...args) => getStatements().add.run(...args)
};

export const deleteReminder = {
  run: (...args) => getStatements().delete.run(...args)
};

export const getAllRemindersByID = {
  all: (...args) => getStatements().getByUserId.all(...args),
  get: (...args) => getStatements().getByUserId.get(...args)
};
