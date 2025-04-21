import { addUser, getUserByUsername, getUserByEmail, getUserByID, deleteUser, getUsers } from "../models/User.js";
import { addUserHealthData } from "../models/UserHealth.js"
import { addUserPreference } from "../models/UserPreference.js"
import { UserIDPrefix } from "../const/const.js";
import { generateMealPlan } from "../utils/generate.js";

const createAccount = async (req, res) => {
    try {
        const { username, email, password, age, phoneNumber, gender, weight, height, chronicConditions, allergies, dietaryRestrictions, medications, goals, cuisinePref, avoid, mealTypePref, cookTimePref, prefIngredients, mealFreq, mealTimings } = req.body;
        const id = (UserIDPrefix * 10) + 2;

        // Check if the username or email already exists
        getUserByUsername.get(username, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error getting account");
            } else if (user) {
                return res.status(409).send({
                    "status": 409,
                    "error": "Username already exists. Please choose a different username."
                });
            } else {
                addUser.run(id, username, email, password, phoneNumber, age, gender, weight, height);
                addUserHealthData.run(id, chronicConditions, allergies, dietaryRestrictions, medications, goals);
                addUserPreference.run(id, cuisinePref, avoid, mealTypePref, cookTimePref, prefIngredients, mealFreq, mealTimings);

            }
            return res.status(201).send({
                "status": 201,
                "message": "Account created successfully!",
                "data": {
                    "id": id,
                    "username": username,
                    "email": email,
                    "phoneNumber": phoneNumber,
                    "age": age,
                }
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            'status': 500,
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
                return res.status(500).send("Error getting account. Internal Server Error");
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

    } catch (err) {

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

    } catch (err) {
        res.status(500).send({
            "status": 500,
            "error": "Error deleting account while accessing Database. /DELETE",
            "err": err
        });
    }
};

const getAllAccounts = async (_, res) => {
    try {
        getUsers.all((err, users) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    status: 500,
                    message: "Error getting account. Internal Server Error",
                    error: err
                });
            } else if (users) {
                return res.status(302).send({
                    "status": 302,
                    "message": "Account found!",
                    "data": users
                });
            } else {
                return res.status(404).send({
                    "status": 404,
                    "error": "No Account found."
                });
            }
        });

    } catch (err) {

        res.status(500).send({
            "status": 500,
            "error": "Error getting all accounts while accessing Database. /GET",
            "err": err
        });
    }
}

export { createAccount, getAccount, deleteAccount, getAllAccounts }; 