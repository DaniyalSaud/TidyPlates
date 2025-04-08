import express from "express";
import { getAccount } from "../controllers/account-router-controller.js";

const router = express.Router();

router.get("/", getAccount);


export default router;