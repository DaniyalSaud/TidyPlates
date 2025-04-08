import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send({
        "status": 200,
        "message": "Welcome to the planning page!"
    });
});

router.get('/meal', async (req, res) => {});

router.get('/download_recipe', async (req, res) => {}); 

router.get('/download_shopping_list', async (req, res) => {});