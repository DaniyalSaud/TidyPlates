import express from "express";
import { getUserReminders, addUserReminder, deleteUserReminder } from "../controllers/reminder-controller.js";
const router = express.Router();

router.get("/", getUserReminders);
router.post("/", addUserReminder);
router.delete("/", deleteUserReminder);
export default router;


