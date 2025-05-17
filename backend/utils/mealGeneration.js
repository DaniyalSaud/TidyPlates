import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import {
  MealPlan3DayGeneratePrompt,
  API_KEY,
  MealGenerationPrompt,
} from '../const/const.js';

// // Get the directory name properly in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Fallback meal plan data when the API fails
const fallbackMealPlanData = {
  "mealPlan": [
    {
      "planId": 1,
      "date": new Date().toISOString().split('T')[0],
      "meals": [
        {
          "mealName": "Scrambled Eggs with Vegetables",
          "time": "08:00",
          "recipe": "1. Beat eggs in a bowl$2. Chop vegetables (bell peppers, onions, spinach)$3. Heat oil in a pan$4. Sauté vegetables until soft$5. Pour in beaten eggs and stir until cooked$6. Season with salt and pepper",
          "ingredients": ["eggs", "bell peppers", "onions", "spinach", "olive oil", "salt", "pepper"],
          "nutritions": {
            "calories": 320,
            "protein": 18,
            "carbs": 10,
            "fat": 24
          },
          "tags": ["breakfast", "high-protein", "vegetarian"]
        },
        {
          "mealName": "Grilled Chicken Salad",
          "time": "13:00",
          "recipe": "1. Season chicken breast with salt and pepper$2. Grill chicken until fully cooked$3. Chop lettuce, tomatoes, and cucumber$4. Mix olive oil and vinegar for dressing$5. Slice grilled chicken$6. Combine all ingredients in a bowl$7. Drizzle with dressing",
          "ingredients": ["chicken breast", "lettuce", "tomatoes", "cucumber", "olive oil", "vinegar", "salt", "pepper"],
          "nutritions": {
            "calories": 420,
            "protein": 35,
            "carbs": 15,
            "fat": 22
          },
          "tags": ["lunch", "high-protein", "low-carb"]
        },
        {
          "mealName": "Baked Salmon with Roasted Vegetables",
          "time": "19:00",
          "recipe": "1. Preheat oven to 400°F (200°C)$2. Season salmon fillet with salt, pepper, and lemon juice$3. Chop broccoli, carrots, and potatoes$4. Toss vegetables with olive oil, salt, and pepper$5. Place salmon and vegetables on a baking sheet$6. Bake for 15-20 minutes until salmon is cooked through",
          "ingredients": ["salmon fillet", "broccoli", "carrots", "potatoes", "olive oil", "lemon juice", "salt", "pepper"],
          "nutritions": {
            "calories": 480,
            "protein": 32,
            "carbs": 30,
            "fat": 25
          },
          "tags": ["dinner", "high-protein", "omega-3"]
        }
      ],
      "dailyTotals": {
        "calories": 1220,
        "protein": 85,
        "carbs": 55,
        "fat": 71
      }
    },
    {
      "planId": 2,
      "date": new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      "meals": [
        {
          "mealName": "Oatmeal with Fruits and Nuts",
          "time": "08:00",
          "recipe": "1. Bring water to a boil$2. Add oats and reduce heat$3. Cook for 5 minutes, stirring occasionally$4. Top with sliced fruits and nuts$5. Drizzle with honey if desired",
          "ingredients": ["rolled oats", "water", "banana", "berries", "almonds", "honey"],
          "nutritions": {
            "calories": 350,
            "protein": 12,
            "carbs": 60,
            "fat": 10
          },
          "tags": ["breakfast", "vegetarian", "high-fiber"]
        },
        {
          "mealName": "Quinoa Bowl with Roasted Vegetables",
          "time": "13:00",
          "recipe": "1. Rinse quinoa thoroughly$2. Cook quinoa according to package directions$3. Chop vegetables (zucchini, bell peppers, onions)$4. Toss vegetables with olive oil, salt, and pepper$5. Roast vegetables at 400°F for 20 minutes$6. Combine quinoa and vegetables$7. Drizzle with olive oil and lemon juice",
          "ingredients": ["quinoa", "zucchini", "bell peppers", "onions", "olive oil", "lemon juice", "salt", "pepper"],
          "nutritions": {
            "calories": 380,
            "protein": 12,
            "carbs": 65,
            "fat": 10
          },
          "tags": ["lunch", "vegetarian", "high-fiber"]
        },
        {
          "mealName": "Turkey Meatballs with Sweet Potato Mash",
          "time": "19:00",
          "recipe": "1. Mix ground turkey with chopped onions, garlic, and spices$2. Form into meatballs$3. Bake at 375°F for 20-25 minutes$4. Peel and chop sweet potatoes$5. Boil sweet potatoes until soft$6. Mash sweet potatoes with a fork$7. Season with salt and pepper$8. Serve meatballs over sweet potato mash",
          "ingredients": ["ground turkey", "onions", "garlic", "sweet potatoes", "olive oil", "salt", "pepper", "paprika"],
          "nutritions": {
            "calories": 450,
            "protein": 30,
            "carbs": 40,
            "fat": 18
          },
          "tags": ["dinner", "high-protein", "low-fat"]
        }
      ],
      "dailyTotals": {
        "calories": 1180,
        "protein": 54,
        "carbs": 165,
        "fat": 38
      }
    },
    {
      "planId": 3,
      "date": new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
      "meals": [
        {
          "mealName": "Greek Yogurt with Honey and Granola",
          "time": "08:00",
          "recipe": "1. Pour Greek yogurt into a bowl$2. Drizzle with honey$3. Top with granola and fresh berries",
          "ingredients": ["Greek yogurt", "honey", "granola", "berries"],
          "nutritions": {
            "calories": 320,
            "protein": 20,
            "carbs": 45,
            "fat": 8
          },
          "tags": ["breakfast", "high-protein", "quick"]
        },
        {
          "mealName": "Tuna Salad Sandwich",
          "time": "13:00",
          "recipe": "1. Drain canned tuna$2. Mix tuna with mayo, diced celery, and onions$3. Season with salt and pepper$4. Toast whole grain bread$5. Add lettuce and tomato slices to bread$6. Add tuna mixture$7. Top with second slice of bread",
          "ingredients": ["canned tuna", "mayonnaise", "celery", "onions", "whole grain bread", "lettuce", "tomato", "salt", "pepper"],
          "nutritions": {
            "calories": 420,
            "protein": 30,
            "carbs": 35,
            "fat": 18
          },
          "tags": ["lunch", "high-protein", "omega-3"]
        },
        {
          "mealName": "Vegetable Stir-Fry with Tofu",
          "time": "19:00",
          "recipe": "1. Press tofu to remove excess water$2. Cut tofu into cubes$3. Chop vegetables (broccoli, carrots, snap peas, bell peppers)$4. Heat oil in a wok or large pan$5. Stir-fry tofu until golden$6. Add vegetables and stir-fry until tender-crisp$7. Add sauce (soy sauce, garlic, ginger)$8. Serve over brown rice",
          "ingredients": ["tofu", "broccoli", "carrots", "snap peas", "bell peppers", "soy sauce", "garlic", "ginger", "brown rice"],
          "nutritions": {
            "calories": 380,
            "protein": 20,
            "carbs": 50,
            "fat": 12
          },
          "tags": ["dinner", "vegetarian", "high-fiber"]
        }
      ],
      "dailyTotals": {
        "calories": 1120,
        "protein": 70,
        "carbs": 130,
        "fat": 38
      }
    }
  ]
};

export async function generateMealPlans(mealPlanData) {
  console.log("Generating meal plan...");
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = MealPlan3DayGeneratePrompt(mealPlanData);
    console.log("Sending prompt to Gemini API...");
    
    // Add timeout to the API call to prevent long hanging requests
    // Use an even shorter timeout for better responsiveness
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("API request timed out")), 8000); // 8 second timeout for better user experience
    });
    
    // Signal that meal plan generation has started (useful for future monitoring)
    console.time("mealPlanGeneration");
    
    // Race the API call against the timeout
    let result;
    try {
      result = await Promise.race([
        ai.models.generateContent({
          model: "gemini-1.5-flash", // Using the faster flash model
          contents: prompt,
          generationConfig: {
            temperature: 0.7,   // Lower temperature for more consistent results
            maxOutputTokens: 2048 // Limit output size for faster generation
          }
        }),
        timeoutPromise
      ]);
    } catch (raceError) {
      // If the API times out, use the fallback data immediately
      console.warn("API call timed out or failed, using fallback data:", raceError);
      console.timeEnd("mealPlanGeneration");
      return fallbackMealPlanData;
    }
    
    console.log("Received response from Gemini API");
    console.timeEnd("mealPlanGeneration");
    const response = await result.text;
    let text = response;
    console.log("Response text length:", text.length);
    console.log("Response preview:", text.substring(0, 200) + "...");

    try {
      // Extract JSON from response if needed
      if (text.includes("```json") && text.includes("```")) {
        text = text.split("```json")[1].split("```")[0].trim();
        console.log("Extracted JSON from markdown code block");
      } else if (text.includes("{") && text.includes("}")) {
        // Try to extract JSON from anywhere in the response
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          text = text.substring(jsonStart, jsonEnd);
          console.log("Extracted potential JSON from response text");
        }
      }
      
      // Validate JSON before parsing
      if (!text || text.trim() === '') {
        console.error("Empty response from API");
        throw new Error("Empty response from API");
      }
      
      const parsedJson = JSON.parse(text);
      console.log("Successfully parsed JSON response");
      return parsedJson;
    } catch (parseError) {
      console.error("Error parsing meal plan JSON:", parseError);
      console.error("Raw text received:", text);
      console.log("Using fallback meal plan data");
      return fallbackMealPlanData;
    }
  } catch (apiError) {
    console.error("Error calling Gemini API:", apiError);
    console.log("Using fallback meal plan data");
    return fallbackMealPlanData;
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

  // Check if an image of same name already exists
  if (fs.existsSync(imagePath)) {
    console.log(`Image already exists: ${imagePath}`);
    return imagePath;
  }

  // Get the directory name properly in ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  // Path to default meal image
  const defaultImagePath = path.resolve(path.join(__dirname, '../public/meal-images/default-meal.png'));
  
  try {
    console.log(`Attempting to generate image for: ${mealName}`);
    // Create the meal image if it doesn't exist
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const contents = [`Generate an image of ${mealName}`, " must have aspect ratio: (16,10)", "high res, no blur, high quality, 4k, realistic, no text, no watermark, no logo, no people, no animals"];

    // Add timeout to the API call to prevent long hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("API request timed out")), 10000); // 10 second timeout
    });
    
    // Race the API call against the timeout
    const response = await Promise.race([
      ai.models.generateContent({
        model: "gemini-2.0-flash-exp-image-generation",
        contents: contents,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      }),
      timeoutPromise
    ]);

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
    
    // Use default image if available
    if (fs.existsSync(defaultImagePath)) {
      try {
        fs.copyFileSync(defaultImagePath, imagePath);
        console.log(`Used default image for ${mealName} after API returned no image`);
        return imagePath;
      } catch (copyErr) {
        console.error(`Failed to copy default image: ${copyErr.message}`);
      }
    }
    
    return '/meal-images/default-meal.png';
  } catch (error) {
    console.error("Error generating meal image:", error);
    
    // Use default image as fallback
    if (fs.existsSync(defaultImagePath)) {
      try {
        fs.copyFileSync(defaultImagePath, imagePath);
        console.log(`Used default image for ${mealName} after error: ${error.message}`);
        return imagePath;
      } catch (copyErr) {
        console.error(`Failed to copy default image: ${copyErr.message}`);
      }
    }
    
    return '/meal-images/default-meal.png';
  }
}

import { defaultFallbackMealPlan } from './defaultFallbackMealPlan.js';

export const formatMealPlan = (mealPlanData) => {
  // Add validation to handle null or invalid data
  if (!mealPlanData) {
    console.error("No meal plan data received");
    return defaultFallbackMealPlan();
  }
  
  // Add a try-catch wrapper around the entire function
  try {
    if (!mealPlanData["mealPlan"] || !Array.isArray(mealPlanData["mealPlan"])) {
      console.error("Invalid meal plan data structure:", mealPlanData);
      return defaultFallbackMealPlan();
    }
  
  const totalPlansCount = mealPlanData["mealPlan"].length;
  let formattedMealPlans = [];

  // Ensure we only have 5 meal plans max
  const plansToProcess = Math.min(totalPlansCount, 5);

  try {
    // If we don't have enough plans, just return the default
    if (plansToProcess < 3) {
      console.warn(`Not enough meal plans in data (${plansToProcess}), using fallback`);
      return defaultFallbackMealPlan();
    }
    
    for (let i = 0; i < plansToProcess; i++) {
      try {
        let currentMealPlan = {};
        let meals = [];
        
        // Safely access data with null checks
        if (!mealPlanData["mealPlan"][i]) {
          console.warn(`Missing meal plan data for day ${i+1}`);
          continue;
        }
        
        let date = mealPlanData["mealPlan"][i]["date"];
        let planId = mealPlanData["mealPlan"][i]["planId"] || i + 1;
        
        // Validate meals array exists
        if (!Array.isArray(mealPlanData["mealPlan"][i]["meals"])) {
          console.warn(`Invalid meals data for day ${i+1}, missing meals array`);
          continue;
        }

        for (let j = 0; j < mealPlanData["mealPlan"][i]["meals"].length; j++) {
          try {
            // Process meal data with defensive coding
            let mealData = mealPlanData["mealPlan"][i]["meals"][j];
            if (!mealData) {
              console.warn(`Missing meal data at index ${j} for day ${i+1}`);
              continue;
            }
            
            let meal = {
              mealName: mealData["mealName"] || `Meal ${j+1}`,
              timeToEat: mealData["time"] || `${8 + j*4}:00`,
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
          } catch (mealError) {
            console.error(`Error processing meal at index ${j} for day ${i+1}:`, mealError);
            // Continue to next meal instead of failing the entire plan
            continue;
          }
        }

        // Skip days with no meals
        if (meals.length === 0) {
          console.warn(`No valid meals found for day ${i+1}, skipping`);
          continue;
        }

        let dailyIntake = mealPlanData["mealPlan"][i]["dailyTotals"] || { calories: 0, protein: 0, carbs: 0, fat: 0 };

        currentMealPlan = {
          planId: planId,  // Include the planId in the formatted meal plan
          date: date || new Date(Date.now() + i * 86400000).toISOString().split('T')[0], // Use current date + i days if no date provided
          meals: meals,
          dailyIntake: {
            calories: dailyIntake["calories"] || 0,
            protein: dailyIntake["protein"] || 0,
            carbs: dailyIntake["carbs"] || 0,
            fat: dailyIntake["fat"] || 0,
          },
        };
        formattedMealPlans.push(currentMealPlan);
      } catch (dayError) {
        console.error(`Error processing day ${i+1}:`, dayError);
        // Continue to next day instead of failing entire function
        continue;
      }
    }

    // If we don't have enough meal plans, use fallback for missing days
    if (formattedMealPlans.length < 3) {
      console.warn(`Not enough valid meal plans (${formattedMealPlans.length}), using fallback for missing days`);
      
      const fallbackPlans = defaultFallbackMealPlan();
      // Only add fallback plans for missing days (up to 3 total)
      for (let i = formattedMealPlans.length; i < 3; i++) {
        formattedMealPlans.push(fallbackPlans[i]);
      }
    }

    return formattedMealPlans;
  } catch (error) {
    console.error("Error while formatting meal plan:", error);
    return defaultFallbackMealPlan();
  }
  } catch (outerError) {
    console.error("Fatal error in formatMealPlan:", outerError);
    return defaultFallbackMealPlan();
    // Return a complete fallback if the formatting process fails
    return defaultFallbackMealPlan();
  }
};
