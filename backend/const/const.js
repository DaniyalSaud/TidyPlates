export const API_KEY = "AIzaSyBialtxoHCE-qI0Lm13ojY3zZJ5MJb1524";

export const MealPlan3DayGeneratePrompt = ({
  age,
  gender,
  weight,
  height,
  chronic_conditions,
  allergies,
  dietaryRestrictions,
  medications,
  goals,
  cuisine_preference,
  avoid,
  meal_type_preference,
  cook_time_preference,
  preferred_ingredients,
  meal_frequency,
  meal_timings,
}) => {
  let prompt = `Generate exactly 3 day meal plans, one meal plan for every day for a patient with the following conditions:
age: ${age}

gender: ${gender}

weight: ${weight} Kg

height: ${height} inches

chronic conditions: ${chronic_conditions || "none"}

allergies: ${allergies || "none"}

dietary restrictions: ${dietaryRestrictions || "none"}

taking medications: ${medications || "none"}

having goals: ${goals || "none"}

cuisine preference: ${cuisine_preference || "none"}

avoid: ${avoid || "none"}

meal type preference: ${meal_type_preference || "none"}

cook time preference: ${
    cook_time_preference == null ? "none" : cook_time_preference
  }

preferred ingredients: ${preferred_ingredients || "none"}

meal frequency: ${meal_frequency || "3"}

meal timings: ${meal_timings || "8:00, 13:00, 19:00"}


- You must generate it in a JSON file with the EXACT following structure:
{
  "mealPlan": [
    {
      "planId": 1,
      "date": "YYYY-MM-DD", 
      "meals": [
        {
          "mealName": "text",
          "time": "HH:MM",
          "recipe": "Step 1$Step 2$Step 3",
          "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
          "nutritions": {
            "calories": 500,
            "protein": 30,
            "carbs": 50,
            "fat": 20
          },
          "tags": ["text", "text", "text"]
        }
      ],
      "dailyTotals": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number
      }
    }
  ]
}

- You MUST provide EXACTLY 3 daily meal plans, numbered from planId 1 through 3.

- Every meal should have a recipe, and the recipe should be in multiple steps, like 1,2,3, 4 .... and each point should be seperated by a delimiter '$'.

- Every ingredient of the recipe must be listed in the "ingredients" array as strings, not objects.

- Nutritional value of each meal and the whole meal plan of every day must be included exactly in the format shown above.

- Nutritional values should only include carbs, protein, fats and calories (not in KCal, but in normal unit of calorie)

- There should be some tags assigned to every meal in the "tags" array.

- There should be time assigned to every meal according to its type (Breakfast, Snack, lunch, dinner) in 24-hour format.

- Add a date to each meal plan. Consider the current date and then set the date of first plan as today, then of the next plan as tomorrow and so on.
- Try to make sure to include as much accurate ingredients quantities in the recipe as possible.
- The daily nutrient intake targets are:
  - 70gm Fats
  - 50gm Protein
  - 310gm Carbohydrates
  - 2000 Kilo Calories

- Every meal plan is not expected to meet this criteria but try to get it as close as possible.

- Keep the units of intake such as gm or Kcal as described but dont include them in the JSON file. Just include the numbers.

- The JSON structure MUST match exactly what is shown above since it will be parsed programmatically.
- Try to be exact about ingredient quantities and dont use terms like "as needed" or "to taste", be clear and exact on the quantity.
Note: Don't include anything else that I haven't said.`;
  
  return prompt.toString();
};

export const MealGenerationPrompt = ({
  date, 
  meal_type, // Breakfast, lunch, dinner, snack
  meal_type_preference,
  preferred_ingredients,
  avoid,
  cook_time_preference,
  cuisine_preference,
  allergies,
  dietary_restrictions,
  chronic_conditions,
  medications,
  goals,
}) => {
  let prompt = `Generate a meal for a patient with the following conditions:
date: ${date}
meal type: ${meal_type}
meal type preference: ${meal_type_preference || "none"}
preferred ingredients: ${preferred_ingredients || "none"}
avoid: ${avoid || "none"}
cook time preference: ${cook_time_preference || "none"}
cuisine preference: ${cuisine_preference || "none"}
allergies: ${allergies || "none"}
dietary restrictions: ${dietary_restrictions || "none"}
chronic conditions: ${chronic_conditions || "none"}
taking medications: ${medications || "none"}
having goals: ${goals || "none"}

- You must generate it in a JSON file with the EXACT following structure:
{
  "meal": {
    "mealName": "${meal_type}",
    "time": "HH:MM",
    "recipe": "Step 1$Step 2$Step 3",
    "ingredients": [
      {"name": "ingredient1", "quantity": "1 cup"}, 
      {"name": "ingredient2", "quantity": "100g"}, 
      {"name": "ingredient3", "quantity": "2 tbsp"}
    ],
    "nutritions": {
      "calories": 500,
      "protein": 30,
      "carbs": 50,
      "fat": 20
    },
    "tags": ["healthy", "quick", "vegetarian"],
    "date": "${date}"
  }
}

- Every meal should have a recipe, and the recipe should be in multiple steps, like 1,2,3 and each point should be seperated by a delimiter '$'.

- Every ingredient of the recipe must be listed in the "ingredients" array as an object containing "name" (string) and "quantity" (string, e.g., "1 cup", "100g").

- Nutritional value of the meal must be included exactly in the format shown above.

- Nutritional values should only include carbs, protein, fats and calories (not in KCal, but in normal unit of calorie)

- There should be some tags assigned to the meal in the "tags" array.
- Be specific and exact about ingredient quantities in the "quantity" field (e.g., "100g", "2 tbsp", "1 medium"). Avoid vague terms like "as needed" or "to taste".
- There should be time assigned to the meal according to its type (Breakfast, Snack, lunch, dinner) in 24-hour format.

- The daily nutrient intake targets are:
  - 70gm Fats
  - 50gm Protein
  - 310gm Carbohydrates
  - 2000 Kilo Calories

- Keep the units of intake such as gm or Kcal as described but dont include them in the JSON file. Just include the numbers for nutritional values.

- The JSON structure MUST match exactly what is shown above since it will be parsed programmatically.

Note: Don't include anything else that I haven't said.`;
  return prompt;
}

export const UserIDPrefix = 1000;