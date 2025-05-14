import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get the image path for a meal based on its name.
 * This function tries to find the correct image for a meal name,
 * falling back to a default image if necessary.
 * 
 * @param {string} mealName - The name of the meal
 * @param {string} apiBaseUrl - Optional API base URL prefix (not needed with proper proxy setup)
 * @return {string} The path to the meal image
 */
export function getMealImagePath(mealName) {
  if (!mealName) {
    return '/meal-images/default-meal.png';
  }
  
  // Clean the meal name for matching
  const cleanMealName = mealName.trim();
  
  // Try exact match first - use the exact meal name
  try {
    // Create an image object to test if the image exists
    const img = new Image();
    const exactPath = `/meal-images/${cleanMealName}.png`;
    img.src = exactPath;
    
    // If we're here, we'll use the exact path
    return exactPath;
  } catch (e) {
    // If there's an error, continue to backup strategies
    console.log("Image not found with exact path, trying alternatives");
  }
  
  // Common meal types to help with matching
  const commonMealTypes = [
    'Quinoa', 'Chicken', 'Salmon', 'Salad', 'Yogurt', 'Oatmeal',
    'Rice', 'Pasta', 'Soup', 'Stir-fry', 'Bowl', 'Toast',
    'Smoothie', 'Sandwich', 'Wrap', 'Curry', 'Berries', 'Lentil',
    'Tofu', 'Turkey', 'Avocado', 'Egg', 'Sweet Potato', 'Baked'
  ];
  
  // Find which common meal type is in the meal name
  const matchedType = commonMealTypes.find(type => 
    cleanMealName.toLowerCase().includes(type.toLowerCase())
  );
  
  // Return path based on matched type or default
  if (matchedType) {
    // Look for a file that starts with the matched type
    return `/meal-images/${matchedType}.png`;
  }
  
  // Return default meal image as last resort
  return '/meal-images/default-meal.png';
}
