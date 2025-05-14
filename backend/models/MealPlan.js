import { initStatements, db } from "./db.js";

// Get the prepared statements
const getStatements = () => {
  const statements = initStatements();
  return statements.mealPlan;
};

// Export the functions that use the statements
export const addMealPlan = {
  run: (...args) => getStatements().add.run(...args)
};

export const deleteMealPlan = {
  run: (...args) => getStatements().delete.run(...args)
};

export const deleteAllMealPlans = {
  run: (...args) => getStatements().deleteAll.run(...args)
};

export const getAllMealPlansByID = {
  all: (...args) => getStatements().getByUserId.all(...args),
  get: (...args) => getStatements().getByUserId.get(...args)
};

// For this one, we need to use a custom query as it's not in our prepared statements
export const getMealPlanCount = {
  get: (callback) => {
    db.get(`SELECT COUNT(*) AS TOTAL_PLANS FROM MealPlan;`, callback);
  },
  all: (callback) => {
    db.all(`SELECT COUNT(*) AS TOTAL_PLANS FROM MealPlan;`, callback);
  }
};
