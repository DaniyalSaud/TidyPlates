import { GoogleGenAI } from "@google/genai";

export async function generateMealPlan(Qty) {
    console.log("Generating meal plan...");
    const API_KEY = 'AIzaSyBialtxoHCE-qI0Lm13ojY3zZJ5MJb1524';
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const generate = async () => {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: "Generate a meal plan for Breakfast, lunch, Dinner for a 60 year old with peanut allergies. Generate a healthy plan with recipe and ingredients, as well as nutritional information of carbs, fats, protein and sodium. The recipe should be concatenated and points should be separated by a comma.",
        });

        return response;
    }
    

    const response = await generate();
    const formattedText = await formatAIResponse(response);

    console.log("Meal plan generated!");
    return formattedText;
}


const formatAIResponse = async (response) => {
    let formattedText = "I am formatted!";

    return formattedText;
}