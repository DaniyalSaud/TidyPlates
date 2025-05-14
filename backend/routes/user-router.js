import express from 'express';
import {addUserHealthAndPreference, deleteUserHealthAndPreference, getUserHealthAndPreference} from '../controllers/user-controller.js';

const router = express.Router();

// Changed to use URL parameter for userID
router.get('/', getUserHealthAndPreference)
router.post('/', addUserHealthAndPreference)
router.delete('/', deleteUserHealthAndPreference)

export default router;