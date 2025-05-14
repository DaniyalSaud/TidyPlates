import { getUsers, deleteUser, getUserByID } from "../models/User.js";
import { deleteAllMealPlans, getAllMealPlansByID } from "../models/MealPlan.js";
import { deleteAllMealsByUserID, getAllMealsByPlanID } from "../models/Meal.js";
import { db } from "../models/db.js";

/**
 * Get all users with their meal plans and meals counts
 */
export const getAllUsersWithStats = async (req, res) => {
  try {
    // Get all users
    const users = await new Promise((resolve, reject) => {
      getUsers.all((err, users) => {
        if (err) reject(err);
        else resolve(users);
      });
    });

    // Get meal plans and meals counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        try {
          // Get meal plans count
          const mealPlansCount = await new Promise((resolve, reject) => {
            db.get(
              "SELECT COUNT(*) as count FROM MealPlan WHERE userID = ?",
              [user.userID],
              (err, result) => {
                if (err) reject(err);
                else resolve(result ? result.count : 0);
              }
            );
          });

          // Get meals count
          const mealsCount = await new Promise((resolve, reject) => {
            db.get(
              `SELECT COUNT(*) as count FROM Meal 
               WHERE planID IN (SELECT planID FROM MealPlan WHERE userID = ?)`,
              [user.userID],
              (err, result) => {
                if (err) reject(err);
                else resolve(result ? result.count : 0);
              }
            );
          });

          // Return user with stats
          return {
            ...user,
            mealPlansCount,
            mealsCount,
          };
        } catch (error) {
          console.error(`Error getting stats for user ${user.userID}:`, error);
          return {
            ...user,
            mealPlansCount: 0,
            mealsCount: 0,
            error: error.message,
          };
        }
      })
    );

    res.status(200).json({
      status: 200,
      message: "Successfully retrieved users with stats",
      users: usersWithStats,
    });
  } catch (error) {
    console.error("Error getting users with stats:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to get users with stats",
      error: error.message,
    });
  }
};

/**
 * Delete a user account by ID
 */
export const deleteUserAccount = async (req, res) => {
  try {
    const { userID } = req.params;
    
    if (!userID) {
      return res.status(400).json({
        status: 400,
        message: "User ID is required",
      });
    }
    
    // Check if user exists
    const user = await new Promise((resolve, reject) => {
      getUserByID.get(userID, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });
    
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    
    // Delete the user - the ON DELETE CASCADE will handle related data deletion
    await new Promise((resolve, reject) => {
      deleteUser.run(userID, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
    
    res.status(200).json({
      status: 200,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to delete user account",
      error: error.message,
    });
  }
};

/**
 * Get system statistics
 */
export const getSystemStats = async (req, res) => {
  try {
    // Get users count
    const usersCount = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM User", (err, result) => {
        if (err) reject(err);
        else resolve(result ? result.count : 0);
      });
    });
    
    // Get meal plans count
    const mealPlansCount = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM MealPlan", (err, result) => {
        if (err) reject(err);
        else resolve(result ? result.count : 0);
      });
    });
    
    // Get meals count
    const mealsCount = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM Meal", (err, result) => {
        if (err) reject(err);
        else resolve(result ? result.count : 0);
      });
    });
    
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved system stats",
      stats: {
        usersCount,
        mealPlansCount,
        mealsCount,
      },
    });
  } catch (error) {
    console.error("Error getting system stats:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to get system stats",
      error: error.message,
    });
  }
};