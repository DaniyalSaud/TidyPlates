import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.join(__dirname, '..', 'tidyplates.db');

// Configure database with better error logging
sqlite3.verbose();

// Database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Database connection error:", err.message);
  console.log(`Connected to SQLite database at ${dbPath}`);
});

// Set busy timeout to wait when database is locked (5 seconds)
db.configure("busyTimeout", 5000);

// Use WAL (Write-Ahead Logging) for better concurrency
db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA foreign_keys = ON;");

// Initialize database tables
const initTables = async () => {
  return new Promise((resolve, reject) => {
    // Create tables in sequence to ensure foreign key relationships work
    const tables = [
      // User table
      `CREATE TABLE IF NOT EXISTS User (
        userID INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        emailAddress TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        phoneNumber TEXT,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        weight INTEGER NOT NULL,
        height INTEGER NOT NULL
      )`,
      
      // Health table
      `CREATE TABLE IF NOT EXISTS Health (
        userID INTEGER PRIMARY KEY,
        chronicConditions TEXT,
        allergies TEXT,
        dietaryRestrictions TEXT,
        medications TEXT,
        goals TEXT,
        FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
      )`,
      
      // Preferences table
      `CREATE TABLE IF NOT EXISTS Preferences (
        userID INTEGER PRIMARY KEY,
        cuisinePref TEXT,
        avoid TEXT,
        mealTypePref TEXT,
        cookTimePref INTEGER,
        prefIngredients TEXT,
        mealFreq INTEGER NOT NULL,
        mealTimings TEXT NOT NULL,
        FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
      )`,
      
      // MealPlan table
      `CREATE TABLE IF NOT EXISTS MealPlan (
        planID INTEGER PRIMARY KEY,
        userID INTEGER NOT NULL,
        planDate TEXT NOT NULL,
        FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
      )`,
      
      // Meal table
      `CREATE TABLE IF NOT EXISTS Meal (
        mealID INTEGER PRIMARY KEY,
        planID INTEGER NOT NULL,
        mealName TEXT NOT NULL,
        mealTime TEXT NOT NULL,
        mealTags TEXT,
        mealPicture TEXT,
        FOREIGN KEY (planID) REFERENCES MealPlan(planID) ON DELETE CASCADE
      )`,
      
      // Nutritions table  
      `CREATE TABLE IF NOT EXISTS Nutritions (
        mealID INTEGER PRIMARY KEY,
        calories INTEGER NOT NULL,
        protein INTEGER NOT NULL,
        carbs INTEGER NOT NULL,
        fats INTEGER NOT NULL,
        FOREIGN KEY (mealID) REFERENCES Meal(mealID) ON DELETE CASCADE
      )`,
      
      // Recipe table
      `CREATE TABLE IF NOT EXISTS Recipe (
        recipeID INTEGER PRIMARY KEY,
        mealID INTEGER NOT NULL,
        recipeInstructions TEXT NOT NULL,
        FOREIGN KEY (mealID) REFERENCES Meal(mealID) ON DELETE CASCADE
      )`,
      
      // RecipeIngredient table
      `CREATE TABLE IF NOT EXISTS RecipeIngredient (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipeID INTEGER NOT NULL,
        ingredientName TEXT NOT NULL,
        ingredientQuantity TEXT NOT NULL,
        FOREIGN KEY (recipeID) REFERENCES Recipe(recipeID) ON DELETE CASCADE
      )`,
      
      // Reminder table
      `CREATE TABLE IF NOT EXISTS Reminder (
        reminderID INTEGER PRIMARY KEY,
        userID INTEGER NOT NULL,
        reminderText TEXT NOT NULL,
        timeToRemind TEXT NOT NULL,
        reminded INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
      )`
    ];
    
    // Execute each CREATE TABLE statement in sequence
    db.serialize(() => {
      try {
        // Begin transaction
        db.run('BEGIN TRANSACTION');
        
        tables.forEach((table, index) => {
          db.run(table, (err) => {
            if (err) {
              console.error(`Error creating table #${index + 1}:`, err);
              db.run('ROLLBACK');
              return reject(err);
            }
            
            // If this is the last table, commit and resolve
            if (index === tables.length - 1) {
              db.run('COMMIT', (err) => {
                if (err) {
                  console.error('Error committing transaction:', err);
                  db.run('ROLLBACK');
                  return reject(err);
                }
                console.log("All database tables created successfully");
                resolve();
              });
            }
          });
        });
      } catch (error) {
        console.error("Error during table creation:", error);
        db.run('ROLLBACK');
        reject(error);
      }
    });
  });
};

// Initialize statements and export them
let statements = null;

const initStatements = () => {
  if (statements) return statements;
  
  statements = {
    // User statements
    user: {
      add: db.prepare(`INSERT INTO User (userID, username, emailAddress, password, phoneNumber, age, gender, weight, height) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`),
      getById: db.prepare("SELECT * FROM User WHERE userID = ?"),
      getByUsername: db.prepare("SELECT * FROM User WHERE username = ?"),
      getByEmail: db.prepare("SELECT * FROM User WHERE emailAddress = ? AND password = ?"),
      getAll: db.prepare("SELECT * FROM User"),
      delete: db.prepare("DELETE FROM User WHERE userID = ?")
    },
    
    // Health statements
    health: {
      add: db.prepare(`INSERT INTO Health (userID, chronicConditions, allergies, dietaryRestrictions, medications, goals) 
                      VALUES (?, ?, ?, ?, ?, ?)`),
      getById: db.prepare("SELECT * FROM Health WHERE userID = ?"),
      delete: db.prepare("DELETE FROM Health WHERE userID = ?")
    },
    
    // Preference statements
    preference: {
      add: db.prepare(`INSERT INTO Preferences (userID, cuisinePref, avoid, mealTypePref, cookTimePref, prefIngredients, mealFreq, mealTimings) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`),
      getById: db.prepare("SELECT * FROM Preferences WHERE userID = ?"),
      delete: db.prepare("DELETE FROM Preferences WHERE userID = ?")
    },
    
    // MealPlan statements
    mealPlan: {
      add: db.prepare(`INSERT INTO MealPlan (planID, userID, planDate) VALUES (?, ?, ?)`),
      getByUserId: db.prepare("SELECT * FROM MealPlan WHERE userID = ?"),
      delete: db.prepare("DELETE FROM MealPlan WHERE planID = ?"),
      deleteAll: db.prepare("DELETE FROM MealPlan WHERE userID = ?")
    },
    
    // Meal statements
    meal: {
      add: db.prepare(`INSERT INTO Meal (mealID, planID, mealName, mealTime, mealTags, mealPicture) VALUES (?, ?, ?, ?, ?, ?)`),
      getByPlanId: db.prepare("SELECT * FROM Meal WHERE planID = ? ORDER BY mealTime"),
      delete: db.prepare("DELETE FROM Meal WHERE mealID = ?"),
      deleteAllByUserId: db.prepare("DELETE FROM Meal WHERE planID IN (SELECT planID FROM MealPlan WHERE userID = ?)")
    },
    
    // Nutrition statements
    nutrition: {
      add: db.prepare(`INSERT INTO Nutritions (mealID, calories, protein, carbs, fats) VALUES (?, ?, ?, ?, ?)`),
      delete: db.prepare("DELETE FROM Nutritions WHERE mealID = ?")
    },
    
    // Recipe statements
    recipe: {
      add: db.prepare(`INSERT INTO Recipe (recipeID, mealID, recipeInstructions) VALUES (?, ?, ?)`),
      delete: db.prepare("DELETE FROM Recipe WHERE recipeID = ?")
    },
    
    // RecipeIngredient statements
    recipeIngredient: {
      add: db.prepare(`INSERT INTO RecipeIngredient (recipeID, ingredientName, ingredientQuantity) VALUES (?, ?, ?)`),
      delete: db.prepare("DELETE FROM RecipeIngredient WHERE recipeID = ?")
    },
    
    // Reminder statements
    reminder: {
      add: db.prepare(`INSERT INTO Reminder (reminderID, userID, reminderText, timeToRemind, reminded) VALUES (?, ?, ?, ?, ?)`),
      getByUserId: db.prepare("SELECT * FROM Reminder WHERE userID = ?"),
      delete: db.prepare("DELETE FROM Reminder WHERE reminderID = ?")
    }
  };
  
  return statements;
};

export { db, initTables, initStatements };
