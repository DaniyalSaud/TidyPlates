import express from "express";
import { getUserMealPlans, addUserMealPlan, deleteUserMealPlan, makePlan } from "../controllers/meal-plan-controller.js";
const router = express.Router();

router.post("/", getUserMealPlans);
// router.post("/", addUserMealPlan);
router.delete("/", deleteUserMealPlan);
router.post("/makePlan", makePlan);
router.post("/generate", makePlan); // Use makePlan for the generate endpoint

export default router;