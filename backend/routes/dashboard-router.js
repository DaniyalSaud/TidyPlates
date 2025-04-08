import express from "express";
import { getAllMealPlansByID, getMealPlanCount } from "../database/MealPlan.js";
import { generateMealPlan } from "../utils/generate.js";
import { getUserByID } from "../database/User.js";
import { getMeal } from "../database/Meal.js";
import { getRemindersByID } from "../database/Reminder.js";
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send({
        "status": 200,
        "message": "Welcome to the dashboard!"
    });
});

router.get("/profile", async (req, res) => {
    try {
        const { id, username } = req.body;

        // Get User's profile information
        const user = await new Promise((resolve, reject) => {
            getUserByID.get(id, (err, user) => {
                if (err) {
                    console.error("Error getting user profile:", err);
                    return reject("Error getting user profile while accessing DB.");
                }
                if (!user) {
                    return reject("User profile not found. Please check your ID.");
                }
                resolve(user);
            });
        });

        // Send the response after both operations are complete
        res.status(200).send({
            "status": 200,
            "message": "User profile found!",
            "data": {
                "user": user
            }
        });

    } catch (error) {
        // Handle errors and send a single response
        res.status(500).send({
            "status": 500,
            "error": error
        });
    }
});

router.get('/meal_plan', async (req, res) => {
    try {
        const { id, username } = req.body;
        // Get User's Meal Plans
        const mealPlanIDs = await new Promise((resolve, reject) => {
            getAllMealPlansByID.all(id, (err, mealPlans) => {
                if (err) {
                    console.error("Error getting user meal plans:", err);
                    return reject("Error getting user meal plans while accessing DB.");
                }
                if (!mealPlans) {
                    return reject("User meal plans not found. Please check your ID.");
                }
                resolve(mealPlans);
            });
        });

        let mealPlans = [];

        for (let i = 0; i < mealPlanIDs.length; i++) {
            const planID = parseInt(mealPlanIDs[i].planID);

            const mealPlan = await new Promise((resolve, reject) => {
                getMeal.all(planID, (err, mealPlan) => {
                    if (err) {
                        console.error("Error getting meal plan:", err);
                        return reject("Error getting meal plan while accessing DB.");
                    }

                    // MUST UNCOMMENT THIS LATER
                    // if (!mealPlan) {
                    //     return reject("Meal plan not found. Please check your ID.");
                    // }

                    resolve(mealPlan);
                });
            });

            mealPlans.push(mealPlan);
        }

        // Send the response after both operations are complete
        res.status(200).send({
            "status": 200,
            "message": "User meal plans found!",
            "data": {
                'username': username,
                "mealPlans": mealPlans
            }
        });
    } catch (error) {
        res.status(500).send({
            'status': 500,
            'error': error
        });
    }
});

router.get('/reminders', async (req, res)=>{
    try {
        const { id, username } = req.body;
        
        const reminders = await new Promise((resolve, reject) => {
            getRemindersByID.all(id, (err, reminders) => {
                if (err) {
                    console.error("Error getting user reminders:", err);
                    return reject("Error getting user reminders while accessing DB.");
                }
                if (!reminders) {
                    return reject("User reminders not found. Please check your ID.");
                }

                if (reminders.length === 0) {
                    return reject("User reminders not found.");
                }
                resolve(reminders);
            });
        });

        res.status(200).send({
            "status": 200,
            "message": "User reminders found!",
            "data": {
                'username': username,
                "reminders": reminders
            }
        });

    }catch (error){
        res.status(500).send({
            'status': 500,
            'error': error
        });
    }
});

router.get('/generate_plan', async (req, res) => {
    try {
        const mealPlans = await generateMealPlan(2);
        res.status(200).send({
            "status": 200,
            "message": "Meal Plan generated successfully!",
            "data": {
                "mealPlans": mealPlans
            }
        });
    } catch (err) {
        console.log(err);
        res.status(404).send({
            "status": 404,
            "error": "Error generating meal plans!    /GET"
        });
    }
});


export default router;