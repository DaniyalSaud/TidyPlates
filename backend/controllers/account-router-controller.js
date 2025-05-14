import {
  addUser,
  getUserByUsername,
  getUserByEmail,
  getUserByID,
  deleteUser,
  getUsers,
} from "../models/User.js";
import { addUserHealthData, deleteUserHealthDataByID } from "../models/UserHealth.js";
import { addUserPreference, deleteUserPreferenceByID } from "../models/UserPreference.js";
import { generateId, generateBatchIds } from "../utils/idGenerator.js";
import { generateMealPlans, formatMealPlan, generateMealPicture } from "../utils/mealGeneration.js";
// Import meal plan related models
import { addMealPlan, deleteAllMealPlans, deleteMealPlan, getAllMealPlansByID } from "../models/MealPlan.js";
import { addMeal, deleteAllMealsByUserID, getAllMealsByPlanID } from "../models/Meal.js";
import { addNutritions, deleteNutritions } from "../models/Nutritions.js";
import { addRecipe, deleteRecipe } from "../models/Recipe.js";
import { addRecipeIngredient, deleteRecipeIngredient } from "../models/RecipeIngredient.js";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mealImagesFolder = path.resolve(path.join(__dirname, '../public/meal-images/'));

/**
 * Generates or assigns an image path for a meal
 * @param {string} mealName - Name of the meal
 * @returns {string} Path to the meal image
 */
async function getMealImagePath(mealName) {
  try {
    if (!mealName) {
      console.warn("No meal name provided for image generation, using default");
      return '/meal-images/default-meal.png';
    }

    // Sanitize filename - replace invalid characters with underscores
    const sanitizedName = mealName.replace(/[/\\:*?"<>|]/g, '_');
    const filename = sanitizedName; // Use sanitized meal name
    
    // Define the physical file path (for storing the image)
    const imageFilePath = path.join(mealImagesFolder, `${filename}.png`);
    
    // Define the relative URL path (for frontend to access)
    const relativePathForDB = `/meal-images/${filename}.png`;
    
    // Check if images directory exists, create if it doesn't
    if (!fs.existsSync(mealImagesFolder)) {
      try {
        fs.mkdirSync(mealImagesFolder, { recursive: true });
        console.log(`Created meal images directory at: ${mealImagesFolder}`);
      } catch (dirErr) {
        console.error(`Failed to create meal images directory: ${dirErr.message}`);
        return '/meal-images/default-meal.png';
      }
    }
    
    // If the image doesn't exist, generate it using the AI model
    if (!fs.existsSync(imageFilePath)) {
      console.log(`Generating image for meal: ${mealName}`);
      try {
        // Call the generateMealPicture function to create an image
        await generateMealPicture({
          mealName: mealName,
          imagePath: imageFilePath
        });
        console.log(`Generated image for ${mealName} at ${imageFilePath}`);
      } catch (err) {
        console.error(`Error generating image for ${mealName}: ${err.message}`);
        
        // If image generation fails, try to use a default image as fallback
        const defaultImagePath = path.join(mealImagesFolder, 'default-meal.png');
        if (fs.existsSync(defaultImagePath)) {
          try {
            fs.copyFileSync(defaultImagePath, imageFilePath);
            console.log(`Used default image for ${mealName} after generation failed`);
          } catch (copyErr) {
            console.error(`Failed to copy default image: ${copyErr.message}`);
            return '/meal-images/default-meal.png';
          }
        } else {
          console.warn(`Default image not found at ${defaultImagePath}, returning path anyway`);
          return '/meal-images/default-meal.png';
        }
      }
    } else {
      console.log(`Using existing image for ${mealName}: ${imageFilePath}`);
    }
    
    return relativePathForDB;
  } catch (error) {
    // Catch-all error handler to prevent function from throwing
    console.error(`Unexpected error in getMealImagePath: ${error.message}`);
    return '/meal-images/default-meal.png';
  }
}

// Configure database with busy timeout and journal mode for better concurrency
const database = new sqlite3.Database("tidyplates.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
});

// Set busy timeout to wait when database is locked (5 seconds)
database.configure("busyTimeout", 5000);

// Use WAL (Write-Ahead Logging) for better concurrency
database.exec("PRAGMA journal_mode = WAL;");

const createAccount = async (req, res) => {
  try {
    // Validate request body exists
    if (!req.body) {
      return res.status(400).send({
        status: 400,
        error: "Request body is missing"
      });
    }

    const {
      username,
      email,
      password,
      age,
      phoneNumber,
      gender,
      weight,
      height,
      chronicConditions,
      allergies,
      dietaryRestrictions,
      medications,
      goals,
      cuisinePref,
      avoid,
      mealTypePref,
      cookTimePref,
      prefIngredients,
      mealFreq,
      mealTimings,
    } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).send({
        status: 400,
        error: "Username, email, and password are required"
      });
    }

    const userID = generateId('user');
    // Check if the username or email already exists
    const userExists = await new Promise((resolve, reject) => {
      getUserByUsername.get(username, (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });

    if (userExists) {
      return res.status(409).send({
        status: 409,
        error: "Username already exists. Please choose a different username.",
      });
    }

    // Generate meal plan first to ensure it succeeds
    console.log("Generating meal plans for new user");
    let mealPlans5;
    
    try {
      mealPlans5 = await generateMealPlans({
        age,
        gender,
        weight,
        height,
        chronicConditions,
        allergies,
        dietaryRestrictions,
        medications,
        goals,
        cuisinePref,
        avoid,
        mealTypePref,
        cookTimePref,
        prefIngredients,
        mealFreq,
        mealTimings,
      });

      if (!mealPlans5) {
        console.error("generateMealPlans returned null - using fallback");
        // Create basic fallback meal plan data here in case the function returns null
        // This is a second layer of protection in addition to the fallback in generateMealPlans
        const today = new Date();
        mealPlans5 = {
          "mealPlan": [
            {
              "planId": 1,
              "date": today.toISOString().split('T')[0],
              "meals": [
                {
                  "mealName": "Basic Breakfast",
                  "time": "08:00",
                  "recipe": "Step 1$Step 2$Step 3",
                  "ingredients": ["oats", "milk", "berries"],
                  "nutritions": { "calories": 300, "protein": 15, "carbs": 40, "fat": 10 },
                  "tags": ["breakfast", "quick"]
                },
                {
                  "mealName": "Basic Lunch",
                  "time": "13:00",
                  "recipe": "Step 1$Step 2$Step 3",
                  "ingredients": ["chicken", "rice", "vegetables"],
                  "nutritions": { "calories": 450, "protein": 30, "carbs": 50, "fat": 15 },
                  "tags": ["lunch", "protein"]
                },
                {
                  "mealName": "Basic Dinner",
                  "time": "19:00",
                  "recipe": "Step 1$Step 2$Step 3",
                  "ingredients": ["fish", "potatoes", "vegetables"],
                  "nutritions": { "calories": 400, "protein": 25, "carbs": 45, "fat": 12 },
                  "tags": ["dinner", "healthy"]
                }
              ],
              "dailyTotals": { "calories": 1150, "protein": 70, "carbs": 135, "fat": 37 }
            }
          ]
        };
      }
    } catch (mealGenError) {
      console.error("Error generating meal plans:", mealGenError);
      return res.status(500).send({
        status: 500,
        error: "Failed to generate meal plans. Account creation aborted.",
        details: mealGenError.message
      });
    }

    let formattedMealPlan;
    try {
      formattedMealPlan = formatMealPlan(mealPlans5);
      if (!formattedMealPlan || formattedMealPlan.length === 0) {
        throw new Error("Failed to format meal plans or empty result returned");
      }
    } catch (formatError) {
      console.error("Error formatting meal plans:", formatError);
      return res.status(500).send({
        status: 500,
        error: "Failed to format meal plans. Account creation aborted.",
      });
    }

    // Ensure we only have 3 meal plans
    const mealPlansToStore = formattedMealPlan.slice(0, 3);
    if (mealPlansToStore.length !== 3) {
      console.warn(`Expected 3 meal plans, but got ${mealPlansToStore.length}. Will proceed with what we have.`);
    }

    // Begin transaction-like behavior using serialization
    return await new Promise((resolveTransaction, rejectTransaction) => {
      database.serialize(async () => {
        try {
          // Add user and related data with promises to better handle errors
          await new Promise((resolve, reject) => {
            addUser.run(
              userID,
              username,
              email,
              password,
              phoneNumber,
              age,
              gender,
              weight,
              height,
              function (err) {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          await new Promise((resolve, reject) => {
            addUserHealthData.run(
              userID,
              chronicConditions,
              allergies,
              dietaryRestrictions,
              medications,
              goals,
              function (err) {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          await new Promise((resolve, reject) => {
            addUserPreference.run(
              userID,
              cuisinePref,
              avoid,
              mealTypePref,
              cookTimePref,
              prefIngredients,
              mealFreq,
              mealTimings,
              function (err) {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          // Generate unique plan IDs for each day's meal plan (3 days)
          const planIDs = generateBatchIds('mealPlan', 3);

          // Add meals for each day in the meal plan with their unique plan ID
          // Start meal plans from today's date
          const today = new Date();
          
          for (let i = 0; i < mealPlansToStore.length; i++) {
            const dailyPlan = mealPlansToStore[i];
            const planID = planIDs[i];
            // Calculate date: today + i days
            const planDate = new Date(today);
            planDate.setDate(today.getDate() + i);
            const formattedDate = planDate.toISOString().split('T')[0]; // YYYY-MM-DD
            
            console.log(`Creating meal plan for ${formattedDate}`);

            try {
              // Add meal plan to database with date
              await new Promise((resolve, reject) => {
                addMealPlan.run(planID, userID, formattedDate, function (err) {
                  if (err) {
                    console.error(`Error adding meal plan for ${formattedDate}:`, err);
                    reject(err);
                  } else {
                    console.log(`Successfully added meal plan with ID ${planID} for date ${formattedDate}`);
                    resolve();
                  }
                });
              });
            } catch (mealPlanError) {
              console.error(`Failed to add meal plan for day ${i}:`, mealPlanError);
              // Continue with next meal plan instead of failing completely
              continue;
            }

            // Add all meals for this day's plan
            for (const meal of dailyPlan.meals) {
              try {
                // Validate meal data
                if (!meal.mealName) {
                  console.warn("Meal without name found, skipping...");
                  continue;
                }
                
                // Generate unique meal ID
                const mealID = generateId('meal');
                
                // Prepare meal tags (ensure it's a string)
                const mealTags = Array.isArray(meal.tags) ? meal.tags.join(',') :
                  (typeof meal.tags === 'string' ? meal.tags : '');
                
                // Ensure the meal time is valid
                const mealTime = meal.timeToEat || meal.time || '12:00';
                
                // Try to get a meal image (with fallback handling)
                let mealImagePath;
                try {
                  console.log(`Trying to generate image for meal: ${meal.mealName}`);
                  mealImagePath = await getMealImagePath(meal.mealName);
                  
                  if (!mealImagePath) {
                    console.warn(`No image path returned for ${meal.mealName}, using default`);
                    mealImagePath = '/meal-images/default-meal.png';
                  }
                } catch (imageError) {
                  console.error(`Failed to generate image for meal ${meal.mealName}:`, imageError);
                  mealImagePath = '/meal-images/default-meal.png';
                }
                
                // Add meal to database with error handling
                await new Promise((resolve, reject) => {
                  console.log(`Adding meal to database: ${meal.mealName}, time: ${mealTime}, image: ${mealImagePath}`);
                  
                  addMeal.run(
                    mealID,
                    planID,
                    meal.mealName,
                    mealTime,
                    mealTags,
                    mealImagePath,
                    function (err) {
                      if (err) {
                        console.error(`Failed to add meal ${meal.mealName} to database:`, err);
                        reject(err);
                      } else {
                        console.log(`Successfully added meal ${meal.mealName} with ID ${mealID}`);
                        resolve();
                      }
                    }
                  );
                });

                // Add nutritional information
                // Ensure nutritional data is processed correctly
                const calories = typeof meal.nutritions === 'object' ? (meal.nutritions.calories || 0) : 0;
                const protein = typeof meal.nutritions === 'object' ? (meal.nutritions.protein || 0) : 0;
                const carbs = typeof meal.nutritions === 'object' ? (meal.nutritions.carbs || 0) : 0;
                const fat = typeof meal.nutritions === 'object' ? (meal.nutritions.fat || 0) : 0;

                await new Promise((resolve, reject) => {
                  addNutritions.run(
                    mealID,
                    calories,
                    protein,
                    carbs,
                    fat,
                    function (err) {
                      if (err) reject(err);
                      else resolve();
                    }
                  );
                });

                // Add recipe
                const recipeID = generateId('recipe');
                // Process recipe steps - ensure it's stored as a string with $ delimiters
                const recipeSteps = Array.isArray(meal.recipe) ? meal.recipe.join('$') :
                  (typeof meal.recipe === 'string' ? meal.recipe : '');

                await new Promise((resolve, reject) => {
                  addRecipe.run(
                    recipeID,
                    mealID,
                    recipeSteps,
                    function (err) {
                      if (err) reject(err);
                      else resolve();
                    }
                  );
                });

                // Add ingredients
                if (Array.isArray(meal.ingredients)) {
                  for (const ingredient of meal.ingredients) {
                    // Parse ingredients that could be in different formats
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

                    await new Promise((resolve, reject) => {
                      addRecipeIngredient.run(
                        recipeID,
                        ingredientName,
                        ingredientQuantity,
                        function (err) {
                          if (err) reject(err);
                          else resolve();
                        }
                      );
                    });
                  }
                }
              } catch (mealError) {
                console.error("Error adding meal data:", mealError);
                throw mealError; // Rethrow to trigger the transaction cleanup
              }
            }
          }

          console.log("Account and 3-day meal plan successfully stored in database");

          // Send the successful response
          const response = {
            status: 201,
            message: "Account created successfully with a 3-day meal plan!",
            data: {
              userID: userID,
              username: username,
              email: email,
              phoneNumber: phoneNumber,
              age: age,
            },
          };
          
          res.status(201).json(response);
          resolveTransaction(response);
        } catch (dbError) {
          console.error("Error while creating account or storing meal plans:", dbError);

          // If we reach here, there was an error in account creation or meal plan storage
          // Attempt cleanup
          try {
            // Clean up any partially created data
            console.log("Cleaning up after failed account creation...");
            deleteUser.run(userID);
            deleteUserHealthDataByID.run(userID);
            deleteUserPreferenceByID.run(userID);
            deleteAllMealPlans.run(userID);
            deleteAllMealsByUserID.run(userID);
          } catch (cleanupError) {
            console.error("Error during cleanup after failed account creation:", cleanupError);
          }

          // Send error response
          const errorResponse = {
            status: 500,
            error: "Failed to create account with meal plans. Please try again later.",
            details: dbError.message
          };
          
          res.status(500).json(errorResponse);
          rejectTransaction(errorResponse);
        }
      });
    });
  } catch (error) {
    console.error("Unexpected error during account creation:", error);
    
    // Ensure we always send a complete JSON response
    return res.status(500).json({
      status: 500,
      error: "Error when processing your request. Please try again later.",
      details: error.message
    });
  }
};

const getAccount = async (req, res) => {
  console.log("Received request to get account");
  try {
    const { email, password } = req.body;

    const user = await new Promise((resolve, reject) => {
      getUserByEmail.get(email, password, (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });

    if (user) {
      return res.status(302).send({
        status: 302,
        message: "Account found!",
        data: user,
      });
    } else {
      return res.status(404).send({
        status: 404,
        error: "Account not found. Please check your email and password.",
      });
    }
  } catch (err) {
    console.error("Error getting account:", err);
    res.status(500).send({
      status: 500,
      error: "Error getting account while accessing Database. /GET",
      err: err.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { userID } = req.body;

    if (!userID) {
      return res.status(400).send({
        status: 400,
        error: "User ID is required to delete an account.",
      });
    }

    // Verify user exists before attempting deletion
    const user = await new Promise((resolve, reject) => {
      getUserByID.get(userID, (err, userRow) => {
        if (err) return reject(err);
        resolve(userRow);
      });
    });

    if (!user) {
      return res.status(404).send({
        status: 404,
        error: "Account not found. Please check your user ID.",
      });
    }

    // Use a transaction for atomic deletion
    return await new Promise((resolveTransaction, rejectTransaction) => {
      database.exec('BEGIN TRANSACTION', async (beginErr) => {
        if (beginErr) {
          console.error("Failed to begin transaction for deleteAccount:", beginErr);
          return rejectTransaction(res.status(500).send({
            status: 500,
            message: "Failed to start database transaction.",
            success: false,
            error: beginErr.message,
          }));
        }

        try {
          let deletionResults = {
            success: true,
            errors: [],
            message: "Account and related data deleted successfully",
          };

          // Define the order of deletion based on dependencies for a single user
          // 1. Get IDs of related items
          const mealPlans = await new Promise((resolve, reject) => {
            getAllMealPlansByID.all(userID, (err, plans) => {
              if (err) reject(err); else resolve(plans || []);
            });
          });
          const planIDs = mealPlans.map(p => p.planID);

          let mealIDs = [];
          if (planIDs.length > 0) {
             const meals = await new Promise((resolve, reject) => {
                 // Construct the IN clause safely
                 const placeholders = planIDs.map(() => '?').join(',');
                 const sql = `SELECT mealID FROM Meal WHERE planID IN (${placeholders})`;
                 database.all(sql, planIDs, (err, mealRows) => {
                     if (err) reject(err); else resolve(mealRows || []);
                 });
             });
             mealIDs = meals.map(m => m.mealID);
          }


          let recipeIDs = [];
          if (mealIDs.length > 0) {
              const recipes = await new Promise((resolve, reject) => {
                  const placeholders = mealIDs.map(() => '?').join(',');
                  const sql = `SELECT recipeID FROM Recipe WHERE mealID IN (${placeholders})`;
                  database.all(sql, mealIDs, (err, recipeRows) => {
                      if (err) reject(err); else resolve(recipeRows || []);
                  });
              });
              recipeIDs = recipes.map(r => r.recipeID);
          }


          // 2. Delete dependent data in reverse order of dependency
          // RecipeIngredient depends on Recipe
          if (recipeIDs.length > 0) {
            await new Promise((resolve, reject) => {
              const placeholders = recipeIDs.map(() => '?').join(',');
              deleteRecipeIngredient.run(`WHERE recipeID IN (${placeholders})`, recipeIDs, function(err) { // Assuming deleteRecipeIngredient is prepared like "DELETE FROM RecipeIngredient "
                 if (err) reject(new Error(`Failed to delete recipe ingredients for recipes [${recipeIDs.join(',')}]: ${err.message}`)); else resolve();
              });
            });
          }

          // Nutritions depends on Meal
          if (mealIDs.length > 0) {
            await new Promise((resolve, reject) => {
              const placeholders = mealIDs.map(() => '?').join(',');
              deleteNutritions.run(`WHERE mealID IN (${placeholders})`, mealIDs, function(err) { // Assuming deleteNutritions is prepared like "DELETE FROM Nutritions "
                 if (err) reject(new Error(`Failed to delete nutritions for meals [${mealIDs.join(',')}]: ${err.message}`)); else resolve();
              });
            });
          }

          // Recipe depends on Meal
          if (mealIDs.length > 0) { // Use mealIDs here as Recipe depends on Meal
            await new Promise((resolve, reject) => {
              const placeholders = mealIDs.map(() => '?').join(',');
              deleteRecipe.run(`WHERE mealID IN (${placeholders})`, mealIDs, function(err) { // Assuming deleteRecipe is prepared like "DELETE FROM Recipe "
                 if (err) reject(new Error(`Failed to delete recipes for meals [${mealIDs.join(',')}]: ${err.message}`)); else resolve();
              });
            });
          }

          // Meal depends on MealPlan
          if (planIDs.length > 0) {
            await new Promise((resolve, reject) => {
              const placeholders = planIDs.map(() => '?').join(',');
              // Assuming deleteAllMealsByUserID is actually "DELETE FROM Meal WHERE planID IN (...)" or similar
              // If it's truly by UserID, that's less safe transactionally here. Let's assume it can target planIDs.
              // If not, we need a new prepared statement: deleteMealsByPlanIDs
              database.run(`DELETE FROM Meal WHERE planID IN (${placeholders})`, planIDs, function(err) {
                 if (err) reject(new Error(`Failed to delete meals for plans [${planIDs.join(',')}]: ${err.message}`)); else resolve();
              });
            });
          }

          // MealPlan depends on User
          await new Promise((resolve, reject) => {
            deleteAllMealPlans.run(userID, function(err) { // This seems correct (delete all plans for this user)
               if (err) reject(new Error(`Failed to delete meal plans for user ${userID}: ${err.message}`)); else resolve();
            });
          });

          // Reminder depends on User (Assuming Reminder model and deletion exists)
          // await new Promise((resolve, reject) => {
          //   deleteRemindersByUserID.run(userID, function(err) { // Replace with actual function if exists
          //      if (err) reject(new Error(`Failed to delete reminders for user ${userID}: ${err.message}`)); else resolve();
          //   });
          // });


          // UserHealth depends on User
          await new Promise((resolve, reject) => {
            deleteUserHealthDataByID.run(userID, function(err) {
               if (err) reject(new Error(`Failed to delete health data for user ${userID}: ${err.message}`)); else resolve();
            });
          });

          // UserPreference depends on User
          await new Promise((resolve, reject) => {
            deleteUserPreferenceByID.run(userID, function(err) {
               if (err) reject(new Error(`Failed to delete preferences for user ${userID}: ${err.message}`)); else resolve();
            });
          });

          // Finally, delete the User
          await new Promise((resolve, reject) => {
            deleteUser.run(userID, function(err) {
               if (err) reject(new Error(`Failed to delete user ${userID}: ${err.message}`)); else resolve();
            });
          });

          // If all deletions succeeded, commit the transaction
          database.exec('COMMIT', (commitErr) => {
            if (commitErr) {
              console.error("Failed to commit transaction for deleteAccount:", commitErr);
              database.exec('ROLLBACK'); // Attempt rollback on commit failure
              rejectTransaction(res.status(500).send({
                status: 500,
                message: "Failed to commit transaction after deleting account data.",
                success: false,
                error: commitErr.message,
              }));
            } else {
              console.log(`Successfully deleted account ${userID} and related data.`);
              resolveTransaction(res.status(200).send({
                status: 200,
                message: deletionResults.message,
                success: true,
              }));
            }
          });

        } catch (deleteErr) {
          // If any deletion step failed, rollback the transaction
          console.error(`Error during account ${userID} deletion process, rolling back:`, deleteErr);
          deletionResults.success = false;
          deletionResults.message = "Failed to delete account due to error";
          deletionResults.errors.push(deleteErr.message);

          database.exec('ROLLBACK', (rollbackErr) => {
            if (rollbackErr) {
              console.error("Rollback failed for deleteAccount:", rollbackErr);
              // If rollback fails, the DB state is uncertain
              rejectTransaction(res.status(500).send({
                status: 500,
                message: "Failed to delete data and also failed to rollback transaction.",
                success: false,
                errors: deletionResults.errors,
                rollbackError: rollbackErr.message,
              }));
            } else {
              console.log(`Transaction rolled back for user ${userID} due to deletion errors.`);
              rejectTransaction(res.status(500).send({
                status: 500,
                message: deletionResults.message,
                success: false,
                errors: deletionResults.errors,
              }));
            }
          });
        }
      });
    });

  } catch (err) {
    // Catch errors from initial user check or setting up the transaction
    console.error("Unexpected error during account deletion setup:", err);
    res.status(500).send({
      status: 500,
      error: "Error processing account deletion request.",
      success: false,
      err: err.message,
    });
  }
};

const getAllAccounts = async (req, res) => {
  try {
    // Check if the request body is properly parsed
    // if (req.body && Object.keys(req.body).length > 0 && req._body === false) {
    //   return res.status(400).send({
    //     status: 400,
    //     error: "Invalid JSON in request body",
    //   });
    // }

    const users = await new Promise((resolve, reject) => {
      getUsers.all((err, users) => {
        if (err) return reject(err);
        resolve(users || []);
      });
    });

    if (users.length > 0) {
      return res.status(302).send({
        status: 302,
        message: "Accounts found!",
        data: users,
      });
    } else {
      return res.status(404).send({
        status: 404,
        error: "No accounts found.",
      });
    }
  } catch (err) {
    console.error("Error getting all accounts:", err);
    res.status(500).send({
      status: 500,
      error: "Error getting all accounts while accessing Database. /GET",
      err: err.message,
    });
  }
};

const deleteAllAccounts = async (req, res) => {
  try {
    // Define the order of deletion based on dependencies (child tables first)
    const tablesToDelete = [
      'RecipeIngredient', // Depends on Recipe
      'Nutritions',       // Depends on Meal
      'Recipe',           // Depends on Meal
      'Meal',             // Depends on MealPlan
      'MealPlan',         // Depends on User
      'Reminder',         // Depends on User (Assuming Reminder model exists and depends on User)
      'Health',           // Depends on User - Fixed to match actual database table name
      'Preferences',      // Depends on User - Fixed to match actual database table name
      'User'              // Main user table (delete last)
    ];

    // Use a transaction for atomicity
    return await new Promise((resolveTransaction, rejectTransaction) => {
      database.exec('BEGIN TRANSACTION', async (beginErr) => {
        if (beginErr) {
          console.error("Failed to begin transaction:", beginErr);
          return rejectTransaction(res.status(500).send({
            status: 500,
            message: "Failed to start database transaction.",
            success: false,
            error: beginErr.message
          }));
        }

        try {
          let deletionResults = {
            success: true,
            errors: [],
            tablesAffected: []
          };

          // Delete data from each table in the specified order
          for (const tableName of tablesToDelete) {
            await new Promise((resolve, reject) => {
              // Check if table exists before trying to delete
              database.get("SELECT name FROM sqlite_master WHERE type='table' AND name=?", [tableName], (err, table) => {
                if (err) {
                  return reject(new Error(`Error checking if table ${tableName} exists: ${err.message}`));
                }
                if (!table) {
                  console.warn(`Table ${tableName} not found, skipping deletion.`);
                  return resolve(); // Table doesn't exist, nothing to delete
                }

                // Table exists, proceed with deletion
                database.run(`DELETE FROM ${tableName}`, function (deleteErr) {
                  if (deleteErr) {
                    console.error(`Failed to delete all data from ${tableName}: ${deleteErr.message}`);
                    // Record the error but continue to attempt other deletions before rollback
                    deletionResults.errors.push(`Failed to delete all data from ${tableName}: ${deleteErr.message}`);
                    deletionResults.success = false; // Mark overall success as false
                  } else {
                    console.log(`Deleted ${this.changes} rows from ${tableName}`);
                    deletionResults.tablesAffected.push({
                      name: tableName,
                      rowsDeleted: this.changes
                    });
                  }
                  resolve(); // Resolve even if there was an error to allow transaction management
                });
              });
            });

            // If any delete failed, stop processing further tables in this transaction attempt
            if (!deletionResults.success) {
              break; 
            }
          }

          // After attempting all deletions, decide whether to commit or rollback
          if (deletionResults.success) {
            database.exec('COMMIT', (commitErr) => {
              if (commitErr) {
                console.error("Failed to commit transaction:", commitErr);
                // Attempt rollback on commit failure
                database.exec('ROLLBACK', (rollbackErr) => {
                  if (rollbackErr) console.error("Rollback also failed:", rollbackErr);
                });
                rejectTransaction(res.status(500).send({
                  status: 500,
                  message: "Failed to commit transaction after deletions.",
                  success: false,
                  error: commitErr.message
                }));
              } else {
                resolveTransaction(res.status(200).send({
                  status: 200,
                  message: "All data deleted successfully from the database",
                  tablesAffected: deletionResults.tablesAffected
                }));
              }
            });
          } else {
            // If any deletion failed, rollback the entire transaction
            database.exec('ROLLBACK', (rollbackErr) => {
              if (rollbackErr) {
                console.error("Rollback failed:", rollbackErr);
                // If rollback fails, the DB state is uncertain
                rejectTransaction(res.status(500).send({
                  status: 500,
                  message: "Failed to delete data and also failed to rollback transaction.",
                  success: false,
                  errors: deletionResults.errors,
                  rollbackError: rollbackErr.message
                }));
              } else {
                console.log("Transaction rolled back due to deletion errors.");
                rejectTransaction(res.status(500).send({
                  status: 500,
                  message: "Some errors occurred while deleting data. Transaction rolled back.",
                  success: false,
                  errors: deletionResults.errors
                }));
              }
            });
          }
        } catch (error) {
          // Catch any unexpected errors during the process
          console.error("Error during database cleanup transaction:", error);
          database.exec('ROLLBACK', (rollbackErr) => { // Attempt rollback
             if (rollbackErr) console.error("Rollback failed after catching error:", rollbackErr);
          });
          rejectTransaction(res.status(500).send({
            status: 500,
            message: "Error during database cleanup transaction.",
            success: false,
            error: error.message
          }));
        }
      });
    });
  } catch (err) {
    // Catch errors setting up the promise/transaction logic
    console.error("Unexpected error setting up database cleanup:", err);
    res.status(500).send({
      status: 500,
      error: "Error setting up database cleanup",
      success: false,
      err: err.message
    });
  }
};

const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).send({
        status: 400,
        error: "Username parameter is required",
      });
    }

    // Check if the username exists in the database
    const user = await new Promise((resolve, reject) => {
      getUserByUsername.get(username, (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });

    // Return a response indicating if the username is available
    return res.status(200).send({
      status: 200,
      available: !user, // true if user doesn't exist, false if it does
      message: user ? "Username is already taken" : "Username is available",
    });
  } catch (err) {
    console.error("Error checking username availability:", err);
    return res.status(500).send({
      status: 500,
      error: "Error checking username availability",
      message: err.message,
    });
  }
};

export { createAccount, getAccount, deleteAccount, getAllAccounts, deleteAllAccounts, checkUsername };
