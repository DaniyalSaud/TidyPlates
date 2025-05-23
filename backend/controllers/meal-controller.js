import { addMeal, getMeal, deleteMeal, getAllMealsByPlanID } from '../models/Meal.js';
import sqlite3 from "sqlite3";
import util from "util";
import { generateId } from '../utils/idGenerator.js';

// Configure database with busy timeout and journal mode for better concurrency
const database = new sqlite3.Database("tidyplates.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
});

// Set busy timeout to wait when database is locked (5 seconds)
database.configure("busyTimeout", 5000);

// Promisify database operations for better error handling
const getMealsByPlanIDAsync = util.promisify((planID, callback) => {
  getAllMealsByPlanID.all(planID, callback);
});

const generateMealID = async () => {
    const mealID = generateId('meal');
    return mealID;
}

const getUserMeal = async (req, res) => {
    try {
        const { planID } = req.body;
        
        if (!planID) {
            return res.status(400).send({
                status: 400,
                message: "planID is required"
            });
        }
        
        // Get all meals for a given plan ID
        const meals = await new Promise((resolve, reject) => {
            getAllMealsByPlanID.all(planID, (err, meals) => {
                if (err) {
                    console.error("Database error:", err.message);
                    reject(err);
                } else {
                    resolve(meals);
                }
            });
        });
        
        if (!meals || meals.length === 0) {
            return res.status(404).send({
                status: 404,
                message: "No meals found for this plan"
            });
        }
        
        return res.status(200).send({
            status: 200,
            message: "Meals retrieved successfully",
            meals: meals
        });
    } catch (err) {
        console.error("Error in getUserMeal:", err);
        return res.status(500).send({
            status: 500,
            message: "Error retrieving meal",
            error: err.message || err
        });
    }
}

const addUserMeal = async (req, res) => {
    try {
        const mealID = await generateMealID();
        const { planID, mealName, mealTime, mealTags, mealPicture } = req.body;
        
        if (!planID) {
            return res.status(400).send({
                status: 400,
                message: "planID is required"
            });
        }
        
        // Add validation for mealName which has a NOT NULL constraint
        if (!mealName) {
            return res.status(400).send({
                status: 400,
                message: "mealName is required"
            });
        }
        
        // Add validation for mealTime which has a NOT NULL constraint
        if (!mealTime) {
            return res.status(400).send({
                status: 400,
                message: "mealTime is required"
            });
        }
        
        // Convert callback to Promise to ensure we respond after the database operation completes
        await new Promise((resolve, reject) => {
            addMeal.run(mealID, planID, mealName, mealTime, mealTags, mealPicture, (err) => {
                if (err) {
                    console.error("Database error:", err.message);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        
        // Only send response after database operation completes successfully
        return res.status(201).send({
            status: 201,
            message: "Meal added successfully",
            mealID: mealID
        });
    } catch (err) {
        console.error("Error in addUserMeal:", err);
        return res.status(500).send({
            status: 500,
            message: "Error adding meal, either same mealID or Internal Server Error",
            error: err.message || err
        });
    }
}

const deleteUserMeal = async (req, res) => {
    try {
        const { mealID } = req.body;
        
        if (!mealID) {
            return res.status(400).send({
                status: 400,
                message: "mealID is required"
            });
        }

        // Convert callback to Promise to ensure we respond after the database operation completes
        await new Promise((resolve, reject) => {
            deleteMeal.run(mealID, (err) => {
                if (err) {
                    console.error("Database error:", err.message);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        
        // Only send response after database operation completes successfully
        return res.status(200).send({
            status: 200,
            message: "Meal deleted successfully"
        });
    } catch (err) {
        console.error("Error in deleteUserMeal:", err);
        return res.status(500).send({
            status: 500,
            message: "Error deleting meal",
            error: err.message || err
        });
    }
}

const getOnlyAllMealsOfMealPlan = async (req, res) => {
    try {
        const { planID } = req.body;
        
        if (!planID) {
            return res.status(400).send({
                status: 400,
                message: "planID is required"
            });
        }

        // Convert callback to Promise to ensure we respond after the database operation completes
        const meals = await new Promise((resolve, reject) => {
            getAllMealsByPlanID.all(planID, (err, rows) => {
                if (err) {
                    console.error("Database error:", err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        
        // Now that we have the data, we can send the response
        if (!meals || meals.length === 0) {
            return res.status(404).send({
                status: 404,
                message: "No meals found for this meal plan"
            });
        }
        
        return res.status(200).send({
            status: 200,
            message: "Meals retrieved successfully",
            meals: meals
        });
    } catch (err) {
        console.error("Error in getOnlyAllMealsOfMealPlan:", err);
        return res.status(500).send({
            status: 500,
            message: "Error retrieving meals",
            error: err.message || err
        });
    }
}

const getUserMealsWithDetails = async (req, res) => {
    // Get planID from either query parameters or request body
    const planID = req.query.planID || (req.body && req.body.planID);

    if (!planID) {
        return res.status(400).send({
            "status": 400,
            "error": "Plan ID is required"
        });
    }

    try {
        const meals = await new Promise((resolve, reject) => {
            getAllMealsByPlanID.all(planID, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        if (meals.length > 0) {
            // Get additional data for each meal (recipe, ingredients, etc.)
            const mealsWithDetails = await Promise.all(meals.map(async (meal) => {
                try {
                    const mealID = meal.mealID;
                    
                    // Get nutritional information
                    const nutrition = await new Promise((resolve, reject) => {
                        database.get("SELECT * FROM Nutritions WHERE mealID = ?", [mealID], (err, row) => {
                            if (err) reject(err);
                            else resolve(row || {});
                        });
                    });

                    // Get recipe
                    const recipe = await new Promise((resolve, reject) => {
                        database.get("SELECT * FROM Recipe WHERE mealID = ?", [mealID], (err, row) => {
                            if (err) reject(err);
                            else resolve(row || {});
                        });
                    });

                    // Get ingredients if recipe exists
                    let ingredients = [];
                    if (recipe && recipe.recipeID) {
                        ingredients = await new Promise((resolve, reject) => {
                            database.all("SELECT * FROM RecipeIngredient WHERE recipeID = ?", [recipe.recipeID], (err, rows) => {
                                if (err) reject(err);
                                else resolve(rows || []);
                            });
                        });
                    }

                    // Format recipe instructions
                    const recipeInstructions = recipe?.recipeInstructions?.split('$') || [];

                    return {
                        ...meal,
                        nutrition,
                        recipe: {
                            ...recipe,
                            instructions: recipeInstructions
                        },
                        ingredients
                    };
                } catch (detailError) {
                    console.error(`Error fetching details for meal ${meal.mealID}:`, detailError);
                    // Return the basic meal data if details can't be fetched
                    return meal;
                }
            }));

            return res.status(200).send({
                "status": 200,
                "meals": mealsWithDetails
            });
        } else {
            return res.status(404).send({
                "status": 404,
                "error": "No meals found for this plan.",
                "meals": []
            });
        }
    } catch (err) {
        console.error("Error getting meals:", err);
        res.status(500).send({
            "status": 500,
            "error": "Error getting meals while accessing Database. /GET",
            "err": err.message
        });
    }
};


export { getUserMeal, addUserMeal, deleteUserMeal, getOnlyAllMealsOfMealPlan, getUserMealsWithDetails };