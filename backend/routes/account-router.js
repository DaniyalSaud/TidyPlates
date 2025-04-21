import express from "express";
import { createAccount, deleteAccount, getAccount, getAllAccounts } from "../controllers/account-router-controller.js";
import ReminderRouter from "./reminder-router.js"
const router = express.Router();

router.get("/", getAccount);
router.get("/all", getAllAccounts);
router.post("/", createAccount);
router.delete("/", deleteAccount);


router.use("/reminders", ReminderRouter)
export default router;


