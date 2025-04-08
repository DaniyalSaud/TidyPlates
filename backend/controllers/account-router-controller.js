import { addUser, getUserByUsername, getUserByEmail,getUserByID, deleteUser } from "../database/User.js";
import { addUserHealthData } from "../database/UserHealth.js"
import { addUserPreference } from "../database/UserPreference.js"
import { UserIDPrefix } from "../const/const.js";
import { generateMealPlan } from "../utils/generate.js";

const createAccount = async (req, res) => {
    try {
        const { username, email, password, age, phoneNumber, gender, weight, height, chronicConditions, allergies, dietaryRestrictions, medications, goals, cuisinePref, avoid, mealTypePref, cookTimePref, prefIngredients, mealFreq, mealTimings } = req.body;
        const id = (UserIDPrefix * 10) + 2;

        // Check if there is a user with the same username
        getUserByUsername.get(username, async (err, user) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error getting account");
            } else if (user) {
                return res.status(405).send({
                    'status': 405,
                    'error': "Username already in use. Please try a new username."
                });
            } else {
                addUser.run(id, username, email, password, phoneNumber, age, gender, weight, height);
                addUserHealthData.run(id, chronicConditions, allergies, dietaryRestrictions, medications, goals);
                addUserPreference.run(id, cuisinePref, avoid, mealTypePref, cookTimePref, prefIngredients, mealFreq, mealTimings);
                await generateMealPlan(5);
                
                return res.status(201).send({
                    "status": 201,
                    "message": "Account created successfully!",
                    "id": id
                }); // Successfully created
            }
        });

    } catch (error) {
        console.error(error);
        res.status(400).send({
            'status': 400,
            'error': "Error when accessing Database /POST."
        });
    }
};


const getAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
        getUserByEmail.get(email, password, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error getting account");
            } else if (user) {
                return res.status(302).send({
                    "status": 302,
                    "message": "Account found!",
                    "data": user 
                });
            } else {
                return res.status(404).send({
                    "status": 404,
                    "error": "Account not found. Please check your email and password."
                });
            }
        });

    }catch(err){ 

        res.status(500).send({
            "status": 500,
            "error": "Error getting account while accessing Database. /GET",
            "err": err
        });
    }
}

const deleteAccount = async (req, res) => {
    try {
        const { id } = req.body;

        getUserByID.get(id, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error getting account");
            } else if (user) {
                deleteUser.run(id);
                return res.status(200).send({
                    "status": 200,
                    "message": "Account deleted successfully!"
                });
            } else {
                return res.status(404).send({
                    "status": 404,
                    "error": "Account not found. Please check your id."
                });
            }
        });

    }catch(err){
        res.status(500).send({
            "status": 500,
            "error": "Error deleting account while accessing Database. /DELETE",
            "err": err
        });
    }
};

export { createAccount, getAccount, deleteAccount }; 