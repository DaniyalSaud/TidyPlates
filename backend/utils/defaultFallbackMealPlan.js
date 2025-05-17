// Helper function to create default meal plans when API fails completely
export function defaultFallbackMealPlan() {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    
    console.log("Creating fallback meal plan for dates:", 
      today.toISOString().split('T')[0], 
      tomorrow.toISOString().split('T')[0], 
      dayAfter.toISOString().split('T')[0]);

    // Return in the expected format for mealPlans5 - containing a mealPlan array
    return {
      mealPlan: [
        {
          planId: 1,
          date: today.toISOString().split('T')[0],
          meals: [
            {
              mealName: "Simple Breakfast",
              time: "08:00",
              recipe: "Mix oats with milk$Add fruits$Enjoy",
              ingredients: ["oats", "milk", "fruits"],
              nutritions: { calories: 300, protein: 10, carbs: 40, fat: 5 },
              tags: ["breakfast", "quick"]
            },
            {
              mealName: "Simple Lunch",
              time: "13:00",
              recipe: "Prepare salad$Add protein$Dress with olive oil",
              ingredients: ["lettuce", "chicken", "olive oil"],
              nutritions: { calories: 400, protein: 30, carbs: 20, fat: 15 },
              tags: ["lunch", "healthy"]
            },
            {
              mealName: "Simple Dinner",
              time: "19:00",
              recipe: "Cook rice$Steam vegetables$Add protein source",
              ingredients: ["rice", "vegetables", "fish"],
              nutritions: { calories: 500, protein: 25, carbs: 60, fat: 10 },
              tags: ["dinner", "balanced"]
            }
          ],
          dailyTotals: { calories: 1200, protein: 65, carbs: 120, fat: 30 }
        },
        {
          planId: 2,
          date: tomorrow.toISOString().split('T')[0],
          meals: [
            {
              mealName: "Basic Breakfast",
              time: "08:00",
              recipe: "Toast bread$Add avocado$Add eggs",
              ingredients: ["bread", "avocado", "eggs"],
              nutritions: { calories: 350, protein: 15, carbs: 30, fat: 20 },
              tags: ["breakfast", "protein"]
            },
            {
              mealName: "Basic Lunch",
              time: "13:00",
              recipe: "Warm soup$Serve with bread$Add side salad",
              ingredients: ["vegetable soup", "bread", "salad"],
              nutritions: { calories: 350, protein: 12, carbs: 40, fat: 10 },
              tags: ["lunch", "comfort food"]
            },
            {
              mealName: "Basic Dinner",
              time: "19:00",
              recipe: "Grill chicken$Steam vegetables$Add quinoa",
              ingredients: ["chicken breast", "vegetables", "quinoa"],
              nutritions: { calories: 450, protein: 35, carbs: 45, fat: 12 },
              tags: ["dinner", "high protein"]
            }
          ],
          dailyTotals: { calories: 1150, protein: 62, carbs: 115, fat: 42 }
        },
        {
          planId: 3,
          date: dayAfter.toISOString().split('T')[0],
          meals: [
            {
              mealName: "Quick Breakfast",
              time: "08:00",
              recipe: "Blend fruits$Add yogurt$Mix well",
              ingredients: ["banana", "berries", "yogurt"],
              nutritions: { calories: 300, protein: 8, carbs: 50, fat: 5 },
              tags: ["breakfast", "quick"]
            },
            {
              mealName: "Quick Lunch",
              time: "13:00",
              recipe: "Prepare sandwich$Add fillings$Pack to go",
              ingredients: ["bread", "cheese", "vegetables"],
              nutritions: { calories: 400, protein: 15, carbs: 45, fat: 10 },
              tags: ["lunch", "portable"]
            },
            {
              mealName: "Quick Dinner",
              time: "19:00",
              recipe: "Heat soup$Toast bread$Serve together",
              ingredients: ["vegetable soup", "bread", "butter"],
              nutritions: { calories: 350, protein: 10, carbs: 45, fat: 10 },
              tags: ["dinner", "comfort"]
            }
          ],
          dailyTotals: { calories: 1050, protein: 33, carbs: 140, fat: 25 }
        }
      ]
    };
  } catch (error) {
    console.error("Error in defaultFallbackMealPlan:", error);
    // Return an absolute minimal fallback as last resort
    return {
      mealPlan: [
        {
          planId: 1,
          date: new Date().toISOString().split('T')[0],
          meals: [
            {
              mealName: "Emergency Breakfast",
              time: "08:00",
              recipe: "Simple preparation",
              ingredients: ["basic food"],
              nutritions: { calories: 300, protein: 10, carbs: 40, fat: 5 },
              tags: ["breakfast"]
            }
          ],
          dailyTotals: { calories: 300, protein: 10, carbs: 40, fat: 5 }
        },
        {
          planId: 2,
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          meals: [
            {
              mealName: "Emergency Breakfast",
              time: "08:00",
              recipe: "Simple preparation",
              ingredients: ["basic food"],
              nutritions: { calories: 300, protein: 10, carbs: 40, fat: 5 },
              tags: ["breakfast"]
            }
          ],
          dailyTotals: { calories: 300, protein: 10, carbs: 40, fat: 5 }
        },
        {
          planId: 3,
          date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
          meals: [
            {
              mealName: "Emergency Breakfast",
              time: "08:00",
              recipe: "Simple preparation",
              ingredients: ["basic food"],
              nutritions: { calories: 300, protein: 10, carbs: 40, fat: 5 },
              tags: ["breakfast"]
            }
          ],
          dailyTotals: { calories: 300, protein: 10, carbs: 40, fat: 5 }
        }
      ]
    };
  }
}
