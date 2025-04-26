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
import { UserIDPrefix } from "../const/const.js";
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
  // Convert meal name to lowercase and replace spaces with hyphens for file naming
  const sanitizedMealName = mealName.toLowerCase().replace(/\s+/g, '-');
  
  // Define the physical file path (for storing the image)
  const imageFilePath = path.join(mealImagesFolder, `${sanitizedMealName}.png`);
  
  // Define the relative URL path (for frontend to access)
  const relativePathForDB = `/meal-images/${sanitizedMealName}.png`;
  
  // Check if images directory exists, create if it doesn't
  if (!fs.existsSync(mealImagesFolder)) {
    fs.mkdirSync(mealImagesFolder, { recursive: true });
    console.log(`Created meal images directory at: ${mealImagesFolder}`);
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
        fs.copyFileSync(defaultImagePath, imageFilePath);
        console.log(`Used default image for ${mealName} after generation failed`);
      }
    }
  } else {
    console.log(`Using existing image for ${mealName}: ${imageFilePath}`);
  }
  
  return relativePathForDB;
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
    const userID = UserIDPrefix * 10 + 2;

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
    const mealPlans5 = await generateMealPlans({
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
      return res.status(500).send({
        status: 500,
        error: "Failed to generate meal plans. Account creation aborted.",
      });
    }

    const formattedMealPlan = formatMealPlan(mealPlans5);
    if (!formattedMealPlan || formattedMealPlan.length === 0) {
      return res.status(500).send({
        status: 500,
        error: "Failed to format meal plans. Account creation aborted.",
      });
    }

    // Ensure we only have 5 meal plans
    const mealPlansToStore = formattedMealPlan.slice(0, 5);
    if (mealPlansToStore.length !== 5) {
      console.warn(`Expected 5 meal plans, but got ${mealPlansToStore.length}. Will proceed with what we have.`);
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

          // Generate unique plan IDs for each day's meal plan (5 days)
          const planIDs = Array.from({ length: 5 }, () => Math.floor(Math.random() * 1000000));

          // Add meals for each day in the meal plan with their unique plan ID
          for (let i = 0; i < mealPlansToStore.length; i++) {
            const dailyPlan = mealPlansToStore[i];
            const planID = planIDs[i];
            const planDate = dailyPlan.date || new Date(Date.now() + i * 86400000).toISOString().split('T')[0];

            // Add meal plan to database with date
            await new Promise((resolve, reject) => {
              addMealPlan.run(planID, userID, planDate, function (err) {
                if (err) reject(err);
                else resolve();
              });
            });

            // Add all meals for this day's plan
            for (const meal of dailyPlan.meals) {
              try {
                // Generate unique meal ID
                const mealID = Math.floor(Math.random() * 1000000);

                // Add meal to database
                // Convert tags array to string if needed
                const mealTags = Array.isArray(meal.tags) ? meal.tags.join(',') :
                  (typeof meal.tags === 'string' ? meal.tags : '');

                await new Promise(async (resolve, reject) => {
                  try {
                    // Generate or get image path for the meal - await this to ensure image is generated
                    const mealImagePath = await getMealImagePath(meal.mealName);
                    
                    // Add meal to database with the image path
                    addMeal.run(
                      mealID,
                      planID,
                      meal.mealName,
                      meal.timeToEat || meal.time || '12:00',
                      mealTags,
                      mealImagePath,
                      function (err) {
                        if (err) reject(err);
                        else resolve();
                      }
                    );
                  } catch (imageError) {
                    console.error(`Error generating image for meal ${meal.mealName}:`, imageError);
                    
                    // Continue with default image path if image generation fails
                    const defaultImagePath = '/meal-images/default-meal.png';
                    addMeal.run(
                      mealID,
                      planID,
                      meal.mealName,
                      meal.timeToEat || meal.time || '12:00',
                      mealTags,
                      defaultImagePath,
                      function (err) {
                        if (err) reject(err);
                        else resolve();
                      }
                    );
                  }
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
                const recipeID = Math.floor(Math.random() * 1000000);
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

          console.log("Account and meal plan successfully stored in database");

          resolveTransaction(res.status(201).send({
            status: 201,
            message: "Account created successfully with meal plans!",
            data: {
              userID: userID,
              username: username,
              email: email,
              phoneNumber: phoneNumber,
              age: age,
            },
          }));
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

          rejectTransaction(
            res.status(500).send({
              status: 500,
              error: "Failed to create account with meal plans. Please try again later.",
              details: dbError.message
            })
          );
        }
      });
    });
  } catch (error) {
    console.error("Unexpected error during account creation:", error);
    return res.status(500).send({
      status: 500,
      error: "Error when processing your request. Please try again later.",
      details: error.message
    });
  }
};

const getAccount = async (req, res) => {
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
        error: "User ID is required to delete an account."
      });
    }

    const user = await new Promise((resolve, reject) => {
      getUserByID.get(userID, (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });

    if (!user) {
      return res.status(404).send({
        status: 404,
        error: "Account not found. Please check your user ID."
      });
    }

    // Begin transaction-like behavior for deletion using serialize
    return await new Promise((resolveTransaction, rejectTransaction) => {
      database.serialize(async () => {
        let deletionResults = {
          success: true,
          errors: [],
          message: "Account deleted successfully"
        };

        try {
          // Get all meal plans for this user
          const mealPlans = await new Promise((resolve, reject) => {
            getAllMealPlansByID.all(userID, (err, plans) => {
              if (err) reject(err);
              else resolve(plans || []);
            });
          });

          // For each meal plan, delete associated data
          for (const plan of mealPlans) {
            // Get all meals for this plan
            const meals = await new Promise((resolve, reject) => {
              getAllMealsByPlanID.all(plan.planID, (err, mealList) => {
                if (err) reject(err);
                else resolve(mealList || []);
              });
            });

            // Delete related data for each meal
            for (const meal of meals) {
              // Delete nutritional information
              await new Promise((resolve) => {
                deleteNutritions.run(meal.mealID, function (err) {
                  if (err) {
                    console.error(`Failed to delete nutritions for meal ${meal.mealID}: ${err.message}`);
                    deletionResults.errors.push(`Failed to delete nutritions for meal ${meal.mealID}`);
                  }
                  resolve();
                });
              });

              // Get and delete recipes
              const recipes = await new Promise((resolve, reject) => {
                database.all("SELECT recipeID FROM Recipe WHERE mealID = ?", [meal.mealID], (err, recipeList) => {
                  if (err) reject(err);
                  else resolve(recipeList || []);
                });
              });

              // Delete recipe ingredients and recipes
              for (const recipe of recipes) {
                try {
                  await new Promise((resolve) => {
                    deleteRecipeIngredient.run(recipe.recipeID, function (err) {
                      if (err) {
                        console.error(`Failed to delete ingredients for recipe ${recipe.recipeID}: ${err.message}`);
                        deletionResults.errors.push(`Failed to delete ingredients for recipe ${recipe.recipeID}`);
                      }
                      resolve();
                    });
                  });

                  await new Promise((resolve) => {
                    deleteRecipe.run(recipe.recipeID, function (err) {
                      if (err) {
                        console.error(`Failed to delete recipe ${recipe.recipeID}: ${err.message}`);
                        deletionResults.errors.push(`Failed to delete recipe ${recipe.recipeID}`);
                      }
                      resolve();
                    });
                  });
                } catch (e) {
                  console.error(`Error during recipe deletion: ${e.message}`);
                  deletionResults.errors.push(`Error during recipe deletion: ${e.message}`);
                }
              }
            }
          }

          // Delete all meals for this user
          await new Promise((resolve) => {
            deleteAllMealsByUserID.run(userID, function (err) {
              if (err) {
                console.error(`Failed to delete meals for user ${userID}: ${err.message}`);
                deletionResults.errors.push(`Failed to delete meals for user ${userID}`);
              }
              resolve();
            });
          });

          // Delete all meal plans for this user
          await new Promise((resolve) => {
            deleteAllMealPlans.run(userID, function (err) {
              if (err) {
                console.error(`Failed to delete all meal plans for user ${userID}: ${err.message}`);
                deletionResults.errors.push(`Failed to delete all meal plans for user ${userID}`);
              }
              resolve();
            });
          });

          // Delete user preferences and health data
          await new Promise((resolve) => {
            deleteUserHealthDataByID.run(userID, function (err) {
              if (err) {
                console.error(`Failed to delete user health data: ${err.message}`);
                deletionResults.errors.push(`Failed to delete user health data`);
              }
              resolve();
            });
          });

          await new Promise((resolve) => {
            deleteUserPreferenceByID.run(userID, function (err) {
              if (err) {
                console.error(`Failed to delete user preferences: ${err.message}`);
                deletionResults.errors.push(`Failed to delete user preferences`);
              }
              resolve();
            });
          });

          // Finally delete the user
          await new Promise((resolve) => {
            deleteUser.run(userID, function (err) {
              if (err) {
                console.error(`Failed to delete user ${userID}: ${err.message}`);
                deletionResults.errors.push(`Failed to delete user ${userID}`);
                deletionResults.success = false;
              }
              resolve();
            });
          });

          // If we had errors but the main user account was deleted
          if (deletionResults.errors.length > 0 && deletionResults.success) {
            deletionResults.message = "Account deleted with some errors in related data deletion";
          }
          // If we couldn't delete the main user account
          else if (!deletionResults.success) {
            deletionResults.message = "Failed to delete the user account, but some related data may have been deleted";
          }

          const statusCode = deletionResults.success ? 200 : 500;

          resolveTransaction(res.status(statusCode).send({
            status: statusCode,
            message: deletionResults.message,
            success: deletionResults.success,
            errors: deletionResults.errors.length > 0 ? deletionResults.errors : undefined
          }));
        } catch (deleteErr) {
          console.error("Error during account deletion process:", deleteErr);
          rejectTransaction(res.status(500).send({
            status: 500,
            message: "Error deleting account and related data",
            success: false,
            error: deleteErr.message
          }));
        }
      });
    });
  } catch (err) {
    console.error("Unexpected error during account deletion:", err);
    res.status(500).send({
      status: 500,
      error: "Error deleting account while accessing Database. /DELETE",
      success: false,
      err: err.message
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
      'UserHealth',       // Depends on User
      'UserPreference',   // Depends on User
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

export { createAccount, getAccount, deleteAccount, getAllAccounts, deleteAllAccounts };
