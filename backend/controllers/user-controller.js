import {
  addUser,
  deleteUser,
  getUserByEmail,
  getUserByID,
  getUserByUsername,
  getUsers,
} from "../models/User.js";
import {
  addUserHealthData,
  deleteUserHealthDataByID,
  getUserHealthDataByID,
} from "../models/UserHealth.js";
import {
  addUserPreference,
  deleteUserPreferenceByID,
  getUserPreferenceByID,
} from "../models/UserPreference.js";

// Here, we will return all info about the user to the frontend which will be shown to the user
// this will include userID, username,
const getUserHealthAndPreference = async (req, res) => {
  try {
    // Changed to use URL parameter instead of request body
    const { userID } = req.body;

    // Wrap SQLite callbacks in Promises to handle them properly
    const getUserPromise = new Promise((resolve, reject) => {
      getUserByID.get(userID, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const getHealthDataPromise = new Promise((resolve, reject) => {
      getUserHealthDataByID.get(userID, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const getPreferenceDataPromise = new Promise((resolve, reject) => {
      getUserPreferenceByID.get(userID, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    // Wait for all promises to resolve
    const [user, healthData, preferenceData] = await Promise.all([
      getUserPromise,
      getHealthDataPromise,
      getPreferenceDataPromise,
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Now send the response with all the data
    res.status(200).json({
      user,
      healthData: healthData || null,
      preferenceData: preferenceData || null,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addUserHealthAndPreference = async (req, res) => {};

const deleteUserHealthAndPreference = async (req, res) => {};

export {
  getUserHealthAndPreference,
  addUserHealthAndPreference,
  deleteUserHealthAndPreference,
};
