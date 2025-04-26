import { getAllRemindersByID, addReminder, deleteReminder } from "../models/Reminder.js";
import sqlite3 from "sqlite3";

// Create a database connection for transactions if needed
const database = new sqlite3.Database("tidyplates.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
});

// Set busy timeout to wait when database is locked (5 seconds)
database.configure("busyTimeout", 5000);

const generateReminderID = () => {
    // Generate a unique reminder ID 
    const uniqueId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    return uniqueId;
}

const getUserReminders = async (req, res) => {
    const { userID } = req.body;

    try {
        if (!userID) {
            return res.status(400).send({
                "status": 400,
                "error": "User ID is required"
            });
        }

        // Convert callback to promise for better error handling
        const reminders = await new Promise((resolve, reject) => {
            getAllRemindersByID.all(userID, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
        
        if (reminders.length === 0) {
            return res.status(404).send({
                "status": 404,
                "error": "No reminders found for this user.",
                "reminders": []
            });
        }
        
        return res.status(200).send({
            "status": 200,
            "reminders": reminders
        });
    }
    catch (err) {
        console.error("Error getting reminders:", err);
        res.status(500).send({
            "status": 500,
            "error": "Error getting reminders while accessing Database. /GET",
            "err": err.message
        });
    }
}

const addUserReminder = async (req, res) => {
    try {
        const { userID, reminderText, timeToRemind } = req.body;
        if (!userID || !reminderText || !timeToRemind) {
            return res.status(400).send({
                "status": 400,
                "error": "Missing required fields: userID, reminderText, or timeToRemind",
            });
        }

        const reminderID = generateReminderID();

        // Convert callback to promise for better error handling
        await new Promise((resolve, reject) => {
            addReminder.run(reminderID, userID, reminderText, timeToRemind, false, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        return res.status(200).send({
            "status": 200,
            "message": "Reminder added successfully.",
            "reminderID": reminderID
        });
    }
    catch (err) {
        console.error("Error adding reminder:", err);
        res.status(500).send({
            "status": 500,
            "error": "Error adding reminder while accessing Database. /POST",
            "err": err.message
        });
    }
}

const deleteUserReminder = async (req, res) => {
    try {
        const { reminderID } = req.body;

        if (!reminderID) {
            return res.status(400).send({
                "status": 400,
                "error": "No reminder ID found in the request body.",
            });
        }

        // Convert callback to promise for better error handling
        await new Promise((resolve, reject) => {
            deleteReminder.run(reminderID, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        return res.status(200).send({
            "status": 200,
            "message": "Reminder deleted successfully.",
        });
    } catch (err) {
        console.error("Error deleting reminder:", err);
        res.status(500).send({
            "status": 500,
            "error": "Error deleting reminder while accessing Database. /DELETE",
            "err": err.message
        });
    }
}

export { getUserReminders, addUserReminder, deleteUserReminder };