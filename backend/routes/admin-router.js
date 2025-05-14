import express from "express";
import { getAllUsersWithStats, deleteUserAccount, getSystemStats } from "../controllers/admin-controller.js";
import isLocal from "../middleware/is-local.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Apply the isLocal middleware to all admin routes
router.use(isLocal);

// Serve the admin panel HTML file
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin.html"));
});

// API endpoints for admin functions
router.get("/api/users", getAllUsersWithStats);
router.delete("/api/users/:userID", deleteUserAccount);
router.get("/api/stats", getSystemStats);

export default router;