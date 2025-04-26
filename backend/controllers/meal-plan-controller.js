import { addMealPlan, deleteMealPlan, getAllMealPlansByID, getMealPlanCount } from '../models/MealPlan.js';
import { addMeal } from '../models/Meal.js';
import { addNutritions } from '../models/Nutritions.js';
import { addRecipe } from '../models/Recipe.js';
import { addRecipeIngredient } from '../models/RecipeIngredient.js';
import { generateMealPlans, formatMealPlan } from '../utils/mealGeneration.js';
import { getUserByID } from '../models/User.js';
import { getUserHealthDataByID } from '../models/UserHealth.js';
import { getUserPreferenceByID } from '../models/UserPreference.js';

const generatePlanID = async () => {
    const planID = Math.floor(Math.random() * 1000000);
    return planID;
}

const getUserMealPlans = async (req, res) => {
    try {
        const { userID } = req.body;

        getAllMealPlansByID.all(userID, (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).send({
                    status: 500,
                    message: "Error retrieving meal plans",
                    error: err
                });
            } else {
                // Check if the user has any meal plans
                if (!rows || rows.length === 0) {
                    return res.status(404).send({
                        status: 404,
                        message: "No meal plans found for this user. Please generate more meal plans."
                    });
                }
                
                res.status(200).send({
                    status: 200,
                    message: "Meal plans retrieved successfully",
                    mealPlans: rows
                });
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: "Error retrieving meal plans",
            error: err
        });
    }
}

const addUserMealPlan = async (req, res) => {
    try {
        const { userID } = req.body;
        const planID = await generatePlanID();

        const mealPlan = {
            planID: planID,
            userID: userID
        }

        addMealPlan.run(mealPlan.planID, mealPlan.userID, (err) => {
            if (err) {
                console.error(err.message);
                res.status(500).send({
                    status: 500,
                    message: "Error adding meal plan",
                    error: err
                });
            } else {
                res.status(200).send({
                    status: 200,
                    message: "Meal plan added successfully",
                    mealPlan: mealPlan
                });
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: "Error adding meal plan",
            error: err
        });
    }
}

const deleteUserMealPlan = async (req, res) => {
    try {
        const { planID } = req.body;

        deleteMealPlan.run(planID, (err) => {
            if (err) {
                console.error(err.message);
                res.status(500).send({
                    status: 500,
                    message: "Error deleting meal plan",
                    error: err
                });
            } else {
                res.status(200).send({
                    status: 200,
                    message: "Meal plan deleted successfully"
                });
            }
        });
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: "Error deleting meal plan",
            error: err
        });
    }
}

// New function to generate 5 meal plans for a user
const makePlan = async (req, res) => {
    try {
        const { userID } = req.body;
        
        if (!userID) {
            return res.status(400).send({
                status: 400,
                message: "userID is required"
            });
        }

        // Get user data to generate personalized meal plans
        const userData = await new Promise((resolve, reject) => {
            getUserByID.get(userID, (err, user) => {
                if (err) reject(err);
                else if (!user) reject(new Error("User not found"));
                else resolve(user);
            });
        });

        // Get user health data
        const healthData = await new Promise((resolve, reject) => {
            getUserHealthDataByID.get(userID, (err, data) => {
                if (err) reject(err);
                else resolve(data || {});
            });
        });

        // Get user preference data
        const preferenceData = await new Promise((resolve, reject) => {
            getUserPreferenceByID.get(userID, (err, data) => {
                if (err) reject(err);
                else resolve(data || {});
            });
        });

        // Combine all user data for meal plan generation
        const mealPlanData = {
            age: userData.age,
            gender: userData.gender,
            weight: userData.weight,
            height: userData.height,
            chronic_conditions: healthData.chronicConditions,
            allergies: healthData.allergies,
            dietaryRestrictions: healthData.dietaryRestrictions,
            medications: healthData.medications,
            goals: healthData.goals,
            cuisine_preference: preferenceData.cuisinePref,
            avoid: preferenceData.avoid,
            meal_type_preference: preferenceData.mealTypePref,
            cook_time_preference: preferenceData.cookTimePref,
            preferred_ingredients: preferenceData.prefIngredients,
            meal_frequency: preferenceData.mealFreq,
            meal_timings: preferenceData.mealTimings
        };

        // Generate 5 meal plans
        console.log("Generating 5 meal plans for user:", userID);
        const mealPlans = await generateMealPlans(mealPlanData);
        
        if (!mealPlans) {
            return res.status(500).send({
                status: 500,
                message: "Failed to generate meal plans"
            });
        }

        const formattedMealPlans = formatMealPlan(mealPlans);
        
        // Store all 5 meal plans in the database
        const storedPlanIDs = [];
        
        for (let i = 0; i < 5 && i < formattedMealPlans.length; i++) {
            const planID = await generatePlanID();
            storedPlanIDs.push(planID);
            
            // Add meal plan
            await new Promise((resolve, reject) => {
                addMealPlan.run(planID, userID, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            
            const dailyPlan = formattedMealPlans[i];
            
            // Add meals for each meal plan
            for (const meal of dailyPlan.meals) {
                // Generate unique meal ID
                const mealID = Math.floor(Math.random() * 1000000);
                
                // Add meal to database
                await new Promise((resolve, reject) => {
                    // Convert tags array to string if needed
                    const mealTags = Array.isArray(meal.tags) ? meal.tags.join(',') : meal.tags;
                    
                    addMeal.run(
                        mealID, 
                        planID, 
                        meal.mealName, 
                        meal.timeToEat,
                        mealTags,
                        "", // mealPicture placeholder
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
                
                // Add nutritional information
                await new Promise((resolve, reject) => {
                    addNutritions.run(
                        mealID,
                        meal.nutritions.calories || 0,
                        meal.nutritions.protein || 0,
                        meal.nutritions.carbs || 0,
                        meal.nutritions.fat || 0,
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
                
                // Add recipe
                const recipeID = Math.floor(Math.random() * 1000000);
                await new Promise((resolve, reject) => {
                    addRecipe.run(
                        recipeID,
                        mealID,
                        meal.recipe.join('$'), // Join recipe steps with $ delimiter
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
                
                // Add ingredients
                if (Array.isArray(meal.ingredients)) {
                    for (const ingredient of meal.ingredients) {
                        await new Promise((resolve, reject) => {
                            // Parsing ingredients that could be in different formats
                            let ingredientName, ingredientQuantity;
                            
                            if (typeof ingredient === 'object') {
                                ingredientName = ingredient.name;
                                ingredientQuantity = ingredient.quantity;
                            } else if (typeof ingredient === 'string') {
                                const parts = ingredient.split(':');
                                ingredientName = parts[0]?.trim() || ingredient;
                                ingredientQuantity = parts[1]?.trim() || "as needed";
                            } else {
                                ingredientName = String(ingredient);
                                ingredientQuantity = "as needed";
                            }
                            
                            addRecipeIngredient.run(
                                recipeID,
                                ingredientName,
                                ingredientQuantity,
                                (err) => {
                                    if (err) reject(err);
                                    else resolve();
                                }
                            );
                        });
                    }
                }
            }
        }

        return res.status(201).send({
            status: 201,
            message: "Successfully generated and stored 5 meal plans",
            planIDs: storedPlanIDs
        });
        
    } catch (err) {
        console.error("Error generating meal plans:", err);
        res.status(500).send({
            status: 500,
            message: "Error generating meal plans",
            error: err.message
        });
    }
};

export { getUserMealPlans, addUserMealPlan, deleteUserMealPlan, makePlan };