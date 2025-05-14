import { database } from './database.js';

// Initialize database with proper table structure
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Setting up database tables...");
      
      // Enable foreign keys
      database.run("PRAGMA foreign_keys = ON;", (err) => {
        if (err) {
          console.error("Error enabling foreign keys:", err);
          return reject(err);
        }
        
        // Create User table first
        const createUserTable = `
          CREATE TABLE IF NOT EXISTS User (
            userID INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            emailAddress TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            phoneNumber TEXT,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            weight INTEGER NOT NULL,
            height INTEGER NOT NULL
          )
        `;
        
        database.run(createUserTable, (err) => {
          if (err) {
            console.error("Error creating User table:", err);
            return reject(err);
          }
          
          console.log("User table created successfully");
          
          // Health table
          const createHealthTable = `
            CREATE TABLE IF NOT EXISTS Health (
              userID INTEGER PRIMARY KEY,
              chronicConditions TEXT,
              allergies TEXT,
              dietaryRestrictions TEXT,
              medications TEXT,
              goals TEXT,
              FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
            )
          `;
          
          database.run(createHealthTable, (err) => {
            if (err) {
              console.error("Error creating Health table:", err);
              return reject(err);
            }
            
            console.log("Health table created successfully");
            
            // Preferences table
            const createPreferencesTable = `
              CREATE TABLE IF NOT EXISTS Preferences (
                userID INTEGER PRIMARY KEY,
                cuisinePref TEXT,
                avoid TEXT,
                mealTypePref TEXT,
                cookTimePref INTEGER,
                prefIngredients TEXT,
                mealFreq INTEGER NOT NULL,
                mealTimings TEXT NOT NULL,
                FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
              )
            `;
            
            database.run(createPreferencesTable, (err) => {
              if (err) {
                console.error("Error creating Preferences table:", err);
                return reject(err);
              }
              
              console.log("Preferences table created successfully");
              
              // MealPlan table
              const createMealPlanTable = `
                CREATE TABLE IF NOT EXISTS MealPlan (
                  planID INTEGER PRIMARY KEY,
                  userID INTEGER NOT NULL,
                  planDate TEXT NOT NULL,
                  FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
                )
              `;
              
              database.run(createMealPlanTable, (err) => {
                if (err) {
                  console.error("Error creating MealPlan table:", err);
                  return reject(err);
                }
                
                console.log("MealPlan table created successfully");
                
                // Meal table
                const createMealTable = `
                  CREATE TABLE IF NOT EXISTS Meal (
                    mealID INTEGER PRIMARY KEY,
                    planID INTEGER NOT NULL,
                    mealName TEXT NOT NULL,
                    mealTime TEXT NOT NULL,
                    mealTags TEXT,
                    mealPicture TEXT,
                    FOREIGN KEY (planID) REFERENCES MealPlan(planID) ON DELETE CASCADE
                  )
                `;
                
                database.run(createMealTable, (err) => {
                  if (err) {
                    console.error("Error creating Meal table:", err);
                    return reject(err);
                  }
                  
                  console.log("Meal table created successfully");
                  
                  // Nutritions table
                  const createNutritionsTable = `
                    CREATE TABLE IF NOT EXISTS Nutritions (
                      mealID INTEGER PRIMARY KEY,
                      calories INTEGER NOT NULL,
                      protein INTEGER NOT NULL,
                      carbs INTEGER NOT NULL,
                      fats INTEGER NOT NULL,
                      FOREIGN KEY (mealID) REFERENCES Meal(mealID) ON DELETE CASCADE
                    )
                  `;
                  
                  database.run(createNutritionsTable, (err) => {
                    if (err) {
                      console.error("Error creating Nutritions table:", err);
                      return reject(err);
                    }
                    
                    console.log("Nutritions table created successfully");
                    
                    // Recipe table
                    const createRecipeTable = `
                      CREATE TABLE IF NOT EXISTS Recipe (
                        recipeID INTEGER PRIMARY KEY,
                        mealID INTEGER NOT NULL,
                        recipeInstructions TEXT NOT NULL,
                        FOREIGN KEY (mealID) REFERENCES Meal(mealID) ON DELETE CASCADE
                      )
                    `;
                    
                    database.run(createRecipeTable, (err) => {
                      if (err) {
                        console.error("Error creating Recipe table:", err);
                        return reject(err);
                      }
                      
                      console.log("Recipe table created successfully");
                      
                      // RecipeIngredient table
                      const createRecipeIngredientTable = `
                        CREATE TABLE IF NOT EXISTS RecipeIngredient (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          recipeID INTEGER NOT NULL,
                          ingredientName TEXT NOT NULL,
                          ingredientQuantity TEXT NOT NULL,
                          FOREIGN KEY (recipeID) REFERENCES Recipe(recipeID) ON DELETE CASCADE
                        )
                      `;
                      
                      database.run(createRecipeIngredientTable, (err) => {
                        if (err) {
                          console.error("Error creating RecipeIngredient table:", err);
                          return reject(err);
                        }
                        
                        console.log("RecipeIngredient table created successfully");
                        
                        // Reminder table
                        const createReminderTable = `
                          CREATE TABLE IF NOT EXISTS Reminder (
                            reminderID INTEGER PRIMARY KEY,
                            userID INTEGER NOT NULL,
                            reminderText TEXT NOT NULL,
                            timeToRemind TEXT NOT NULL,
                            reminded INTEGER NOT NULL DEFAULT 0,
                            FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
                          )
                        `;
                        
                        database.run(createReminderTable, (err) => {
                          if (err) {
                            console.error("Error creating Reminder table:", err);
                            return reject(err);
                          }
                          
                          console.log("Reminder table created successfully");
                          console.log("All database tables created successfully");
                          resolve();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    } catch (error) {
      console.error("Error initializing database:", error);
      reject(error);
    }
  });
};

export { initDatabase };
