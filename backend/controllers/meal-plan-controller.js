import { addMealPlan, deleteMealPlan, getAllMealPlansByID, getMealPlanCount } from '../models/MealPlan.js';
import { addMeal } from '../models/Meal.js';
import { addNutritions } from '../models/Nutritions.js';
import { addRecipe } from '../models/Recipe.js';
import { addRecipeIngredient } from '../models/RecipeIngredient.js';
import { generateMealPlans, formatMealPlan } from '../utils/mealGeneration.js';
import { generateId } from '../utils/idGenerator.js';
import { getUserByID } from '../models/User.js';
import { getUserHealthDataByID } from '../models/UserHealth.js';
import { getUserPreferenceByID } from '../models/UserPreference.js';

const generatePlanID = async () => {
    const planID = generateId('mealPlan');
    return planID;
}

const getUserMealPlans = async (req, res) => {
    console.log("Fetching meal plans for user:", req.body.userID);
    try {
        const { userID } = req.body;
        
        if (!userID) {
            return res.status(400).send({
                status: 400,
                message: "userID is required"
            });
        }

        // Convert the callback-based DB call to a Promise
        const mealPlans = await new Promise((resolve, reject) => {
            getAllMealPlansByID.all(userID, (err, rows) => {
                if (err) {
                    console.error("Database error:", err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        
        // Get today's date in YYYY-MM-DD format for comparison
        const today = new Date().toISOString().split('T')[0];
        console.log(`Looking for meal plan with date: ${today}`);
        
        // Check if there's a meal plan for today
        const todayMealPlan = mealPlans.find(plan => plan.planDate === today);
        
        // Now that we have the data, we can send the response
        if (!mealPlans || mealPlans.length === 0) {
            return res.status(404).send({
                status: 404,
                message: "No meal plans found for this user. Please generate more meal plans."
            });
        }
        
        // If no meal plan for today, inform the frontend
        if (!todayMealPlan) {
            return res.status(200).send({
                status: 200,
                message: "No meal plan found for today. Please generate new meal plans.",
                mealPlans: mealPlans,
                hasTodayPlan: false,
                today: today
            });
        }
        
        return res.status(200).send({
            status: 200,
            message: "Meal plans retrieved successfully",
            mealPlans: mealPlans,
            hasTodayPlan: true,
            todayPlanID: todayMealPlan.planID,
            today: today
        });
    } catch (err) {
        console.error("Error in getUserMealPlans:", err);
        return res.status(500).send({
            status: 500,
            message: "Error retrieving meal plans",
            error: err.message || err
        });
    }
}

const addUserMealPlan = async (req, res) => {
    try {
        const { userID } = req.body;
        
        if (!userID) {
            return res.status(400).send({
                status: 400,
                message: "userID is required"
            });
        }
        
        const planID = await generatePlanID();

        const mealPlan = {
            planID: planID,
            userID: userID
        }

        // Convert callback to Promise to ensure we respond after the database operation completes
        await new Promise((resolve, reject) => {
            addMealPlan.run(mealPlan.planID, mealPlan.userID, (err) => {
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
            message: "Meal plan added successfully",
            mealPlan: mealPlan
        });
    } catch (err) {
        console.error("Error in addUserMealPlan:", err);
        return res.status(500).send({
            status: 500,
            message: "Error adding meal plan",
            error: err.message || err
        });
    }
}

const deleteUserMealPlan = async (req, res) => {
    try {
        const { planID } = req.body;
        
        if (!planID) {
            return res.status(400).send({
                status: 400,
                message: "planID is required"
            });
        }

        // Convert callback to Promise to ensure we respond after the database operation completes
        await new Promise((resolve, reject) => {
            deleteMealPlan.run(planID, (err) => {
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
            message: "Meal plan deleted successfully"
        });
    } catch (err) {
        console.error("Error in deleteUserMealPlan:", err);
        return res.status(500).send({
            status: 500,
            message: "Error deleting meal plan",
            error: err.message || err
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
        
        // Store 3 meal plans in the database starting from today
        const storedPlanIDs = [];
        const today = new Date();
        
        // Only store 3 meal plans instead of 5
        for (let i = 0; i < 3 && i < formattedMealPlans.length; i++) {
            const planID = await generatePlanID();
            storedPlanIDs.push(planID);
            
            // Calculate date: today + i days
            const planDate = new Date(today);
            planDate.setDate(today.getDate() + i);
            const formattedDate = planDate.toISOString().split('T')[0]; // YYYY-MM-DD
            
            console.log(`Creating meal plan for ${formattedDate}`);
            
            // Add meal plan with the date
            await new Promise((resolve, reject) => {
                addMealPlan.run(planID, userID, formattedDate, (err) => {
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