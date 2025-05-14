import { initStatements } from "./db.js";

// Get the prepared statements
const getStatements = () => {
  const statements = initStatements();
  return statements.meal;
};

// Export the functions that use the statements
export const addMeal = {
  run: (...args) => getStatements().add.run(...args)
};

export const deleteMeal = {
  run: (...args) => getStatements().delete.run(...args)
};

export const getMeal = {
  all: (...args) => getStatements().getByPlanId.all(...args),
  get: (...args) => getStatements().getByPlanId.get(...args)
};

export const deleteAllMealsByUserID = {
  run: (...args) => getStatements().deleteAllByUserId.run(...args)
};

export const getAllMealsByPlanID = {
  all: (...args) => getStatements().getByPlanId.all(...args),
  get: (...args) => getStatements().getByPlanId.get(...args)
};