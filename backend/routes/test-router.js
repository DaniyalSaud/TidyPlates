import express from "express";
import { generateMealPicture } from "../utils/mealGeneration.js";

const router = express.Router();

router.get('/meal/image', async (req, res) => {
    try {
        const { mealName } = req.body;

        if (!mealName) {
            return res.status(400).send({
                status: 400,
                message: 'Meal name is required'
            });
        }

        // Generate the meal image - pass an object with mealName property
        const imageUrl = await generateMealPicture({ mealName });
        if (!imageUrl) {
            return res.status(404).send({
                status: 404,
                message: 'Meal image not found'
            });
        }

        // Send the image URL as a response
        res.status(200).send({
            status: 200,
            message: 'Meal image fetched successfully',
            imageUrl: imageUrl
        });

    } catch (error) {
        console.error('Error fetching meal image:', error);
        res.status(500).send({
            status: 500,
            message: 'Error fetching meal image',
            error: error.message
        });
    }
});

export default router;