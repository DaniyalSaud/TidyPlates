import express from "express";
import { getUserMealPlans, addUserMealPlan, deleteUserMealPlan, makePlan } from "../controllers/meal-plan-controller.js";
const router = express.Router();

router.get("/", getUserMealPlans);
router.post("/", addUserMealPlan);
router.delete("/", deleteUserMealPlan);
router.post("/makePlan", makePlan);

export default router;