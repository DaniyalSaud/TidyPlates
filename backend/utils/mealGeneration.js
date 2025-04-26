import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import {
  MealPlan5DayGeneratePrompt,
  API_KEY,
  MealGenerationPrompt,
} from '../const/const.js';

// // Get the directory name properly in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

export async function generateMealPlans(mealPlanData) {
  console.log("Generating meal plan...");
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = MealPlan5DayGeneratePrompt(mealPlanData);
  const result = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt
  });
  const response = await result.text;
  let text = response;
  console.log(text);

  try {
    // Extract JSON from response if needed
    if (text.includes("```json") && text.includes("```")) {
      text = text.split("```json")[1].split("```")[0].trim();
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing meal plan JSON:", error);
    return null;
  }
}

export async function generateMeal(mealData) {
  console.log("Generating meal ...");
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(MealGenerationPrompt(mealData));
  const response = await result.response;
  let text = response.text();

  try {
    // Extract JSON from response if needed
    if (text.includes("```json") && text.includes("```")) {
      text = text.split("```json")[1].split("```")[0].trim();
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing meal JSON:", error);
    return null;
  }
}

export async function generateMealPicture({ mealName, imagePath}) {
  if (!mealName || !imagePath) {
    console.error("Missing meal name for image generation or missing image path");
    return null;
  }

  // Use absolute path with proper __dirname
  // const mealImagesFolder = path.resolve(path.join(__dirname, '../public/meal-images/'));
  
  // Ensure the directory exists
  // if (!fs.existsSync(mealImagesFolder)) {
  //   fs.mkdirSync(mealImagesFolder, { recursive: true });
  //   console.log(`Created directory: ${mealImagesFolder}`);
  // }

  // const imagePath = path.join(mealImagesFolder, `${mealName}.png`);

  // Check if an image of same name already exists
  if (fs.existsSync(imagePath)) {
    console.log(`Image already exists: ${imagePath}`);
    return imagePath; // Return the path instead of undefined
  }

  // Create the meal image if it doesn't exist
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const contents = [`Generate an image of ${mealName}`, "aspect ratio: (16,10)", "high res, no blur, high quality, 4k, realistic, no text, no watermark, no logo, no people, no animals"];

  try {
    // Set responseModalities to include "Image" so the model can generate an image
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        
        fs.writeFileSync(imagePath, buffer);
        console.log(`Image saved as ${imagePath}`);
        return imagePath;
      }
    }
    
    // If we reach here, no image was found in the response
    console.error("No image data received from API");
    return null;
  } catch (error) {
    console.error("Error generating meal image:", error);
    return null;
  }
}

export const formatMealPlan = (mealPlanData) => {
  const totalPlansCount = mealPlanData["mealPlan"].length;
  let formattedMealPlans = [];

  // Ensure we only have 5 meal plans max
  const plansToProcess = Math.min(totalPlansCount, 5);

  for (let i = 0; i < plansToProcess; i++) {
    let currentMealPlan = {};
    let meals = [];
    let date = mealPlanData["mealPlan"][i]["date"];
    let planId = mealPlanData["mealPlan"][i]["planId"] || i + 1;

    for (let j = 0; j < mealPlanData["mealPlan"][i]["meals"].length; j++) {
      // Process meal data
      let mealData = mealPlanData["mealPlan"][i]["meals"][j];
      let meal = {
        mealName: mealData["mealName"],
        timeToEat: mealData["time"],
        recipe: typeof mealData["recipe"] === 'string' ?
          mealData["recipe"].split("$") :
          (Array.isArray(mealData["recipe"]) ? mealData["recipe"] : []),
        ingredients: Array.isArray(mealData["ingredients"]) ?
          mealData["ingredients"].map(ingredient => typeof ingredient === 'object' ?
            JSON.stringify(ingredient) : ingredient) :
          [],
        nutritions: typeof mealData["nutritions"] === 'object' ?
          mealData["nutritions"] :
          { calories: 0, protein: 0, carbs: 0, fat: 0 },
        tags: Array.isArray(mealData["tags"]) ?
          mealData["tags"] :
          (typeof mealData["tags"] === 'string' ? mealData["tags"].split(',') : []),
      };
      meals.push(meal);
    }

    let dailyIntake = mealPlanData["mealPlan"][i]["dailyTotals"] || { calories: 0, protein: 0, carbs: 0, fat: 0 };

    currentMealPlan = {
      planId: planId,  // Include the planId in the formatted meal plan
      date: date,
      meals: meals,
      dailyIntake: {
        calories: dailyIntake["calories"] || 0,
        protein: dailyIntake["protein"] || 0,
        carbs: dailyIntake["carbs"] || 0,
        fat: dailyIntake["fat"] || 0,
      },
    };
    formattedMealPlans.push(currentMealPlan);
  }

  // If we have fewer than 5 meal plans, log a warning
  if (formattedMealPlans.length < 5) {
    console.warn(`Expected 5 meal plans, but only ${formattedMealPlans.length} were generated.`);
  }

  return formattedMealPlans;
};
