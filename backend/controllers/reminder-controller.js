// To fetch data from the database about the user whenever the user is logged in, we can use the following code:

import { getAllRemindersByID } from "../models/Reminder.js";

const getUserSpecificMealPlans = async (req, res) => {

}

const getUserReminders = async (req, res) => {
    const {id} = req.params;

    try{
        getAllRemindersByID.all(id, (err, reminders)=>{
            if(err){
                res.status(500).send({
                    "status": 500,
                    "error": "Error getting reminders while accessing Database. /GET",
                    "err": err
                });
            }
            else if (reminders.length === 0){
                res.status(404).send({
                    "status": 404,
                    "error": "No reminders found for this user.",
                    "reminders": []
                });
            }
            else{
                res.status(200).send({
                    "status": 200, 
                    "reminders": reminders
                });
            }
        });
    }
    catch(err){
        res.status(500).send({
            "status": 500,
            "error": "Error getting reminders while accessing Database. /GET",
            "err": err
        });
    }
}

const addUserReminder = async (req, res) => {}
const deleteUserReminder = async (req, res) => {}

export { getUserReminders, addUserReminder, deleteUserReminder, getUserSpecificMealPlans };