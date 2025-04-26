import express from "express";
import {getUserMealsWithDetails, addUserMeal, deleteUserMeal, getOnlyAllMealsOfMealPlan } from "../controllers/meal-controller.js";
const router = express.Router();

router.get("/", getUserMealsWithDetails);
router.post("/", addUserMeal);
router.delete("/", deleteUserMeal);
router.get("/onlymeals", getOnlyAllMealsOfMealPlan);

export default router;