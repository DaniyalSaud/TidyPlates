import express from "express";
import { createAccount, getAccount, deleteAccount } from "../controllers/signup-router-controllers.js";
const router = express.Router();

router.get("/:id", getAccount);

router.post("/:id", createAccount);

router.delete("/:id", deleteAccount);

export default router;


