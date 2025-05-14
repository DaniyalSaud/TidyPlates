import express from "express";
import { createAccount, deleteAccount, getAccount, getAllAccounts, deleteAllAccounts, checkUsername } from "../controllers/account-router-controller.js";
import ReminderRouter from "./reminder-router.js"
import MealPlanRouter from "./meal-plan-router.js"
import MealsRouter from "./meal-router.js"
import TestRouter from "./test-router.js"
import UserRouter from './user-router.js'

const router = express.Router();

// Add error handling middleware for JSON parsing errors
router.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send({
      status: 400,
      error: "Invalid JSON in request body",
      message: err.message
    });
  }
  next();
});

router.post("/login", getAccount);  // Changed to a more specific endpoint for login
router.get("/all", getAllAccounts);
router.delete("/all", deleteAllAccounts);
router.post("/register", createAccount);  // Changed to a more specific endpoint for registration
router.delete("/", deleteAccount);
router.get("/check-username", checkUsername); // New endpoint to check if username is available

router.use("/reminders", ReminderRouter);
router.use("/mealplan", MealPlanRouter);
router.use('/meals', MealsRouter);
router.use('/user', UserRouter);

router.use('/test', TestRouter);
export default router;