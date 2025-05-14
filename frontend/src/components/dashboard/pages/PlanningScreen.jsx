import React, { useState } from 'react'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AutoFixNormalOutlinedIcon from '@mui/icons-material/AutoFixNormalOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import IngredientItem from '../components/IngredientItem';
import InstructionsItem from '../components/InstructionsItem';
import { useEffect, useContext } from 'react';
import { LoggedInContext, UserIDContext } from '../../../contexts/loginContext';
import { useNavigate } from 'react-router';
import { getMealImagePath } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function PlanningScreen() {
    const navigate = useNavigate();
    const { loggedIn } = useContext(LoggedInContext);
    const { userID } = useContext(UserIDContext);
    const [currentMeal, setCurrentMeal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Add state for simulated hour
    const [simulatedHour, setSimulatedHour] = useState(null);
    
    // States for portion size dialog
    const [portionMultiplier, setPortionMultiplier] = useState(1.0);
    const [scaledNutrition, setScaledNutrition] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    });
    
    // States for similar recipe generation
    const [dietaryPreference, setDietaryPreference] = useState("none");
    const [includedIngredients, setIncludedIngredients] = useState("");
    const [excludedIngredients, setExcludedIngredients] = useState("");
    const [generatingRecipe, setGeneratingRecipe] = useState(false);
    
    // Function to update portion size
    const updatePortionSize = (increment) => {
        // Ensure portion size stays within reasonable limits (0.25x to 4x)
        let newMultiplier = portionMultiplier + increment;
        if (newMultiplier < 0.25) newMultiplier = 0.25;
        if (newMultiplier > 4) newMultiplier = 4;
        
        setPortionMultiplier(newMultiplier);
        
        // Scale nutrition values based on the multiplier
        if (currentMeal && currentMeal.nutrition) {
            setScaledNutrition({
                calories: Math.round(currentMeal.nutrition.calories * newMultiplier),
                protein: Math.round(currentMeal.nutrition.protein * newMultiplier),
                carbs: Math.round(currentMeal.nutrition.carbs * newMultiplier),
                fat: Math.round(currentMeal.nutrition.fat * newMultiplier)
            });
        }
    };
    
    // Function to apply the portion size change
    const applyPortionSizeChange = () => {
        if (currentMeal) {
            // Create a copy of the current meal with updated nutrition values
            const updatedMeal = {
                ...currentMeal,
                nutrition: {
                    ...scaledNutrition
                },
                // Scale ingredients quantities if they have numbers
                ingredients: currentMeal.ingredients?.map(ing => {
                    if (typeof ing === 'string') return ing;
                    
                    // Try to extract and scale numeric values from quantity if present
                    let newQuantity = ing.quantity;
                    if (ing.quantity) {
                        // Extract number from quantity string (e.g., "2 cups" -> "2")
                        const match = ing.quantity.match(/(\d+(\.\d+)?)/);
                        if (match && match[1]) {
                            const numValue = parseFloat(match[1]);
                            const scaled = (numValue * portionMultiplier).toFixed(1);
                            // Replace the number in the original string, keeping units
                            newQuantity = ing.quantity.replace(match[1], scaled);
                        }
                    }
                    
                    return {
                        ...ing,
                        quantity: newQuantity
                    };
                }) || []
            };
            
            setCurrentMeal(updatedMeal);
        }
    };
    
    // Function to generate a similar recipe
    const generateSimilarRecipe = async () => {
        setGeneratingRecipe(true);
        try {
            // In a real implementation, this would call an API to generate a similar recipe
            // For now, we'll simulate a delay and show a success message
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message for now
            alert('Similar recipe generation would connect to the backend AI service in a real implementation');
            
            // Reset form fields
            setDietaryPreference("none");
            setIncludedIngredients("");
            setExcludedIngredients("");
        } catch (error) {
            console.error('Error generating similar recipe:', error);
            alert('Failed to generate similar recipe. Please try again.');
        } finally {
            setGeneratingRecipe(false);
        }
    };

    // Function to generate new meal plans
    const generateNewMealPlans = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Call the API to generate new meal plans
            const response = await fetch('/api/account/mealplan/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID }),
                signal: AbortSignal.timeout(30000) // 30 second timeout (meal plan generation can take time)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to generate meal plans: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Generated new meal plans:', data);
            
            if (data.status === 200 || data.status === 201) {
                // Fetch the new meal after successful generation
                await fetchCurrentMeal();
                alert('New meal plans have been generated starting from today!');
            } else {
                throw new Error('Meal plan generation did not return a success status');
            }
        } catch (err) {
            console.error('Error generating new meal plans:', err);
            setError(`Failed to generate meal plans: ${err.message}`);
            setIsLoading(false);
        }
    };

    // Function to handle download of meal as HTML
    const handleDownload = () => {
        if (!currentMeal) return;
        
        // Create HTML content for the meal
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${currentMeal.name} - TidyPlates</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    color: #333;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #4338ca;
                    padding-bottom: 10px;
                }
                .meal-name {
                    font-size: 32px;
                    margin: 0;
                    color: #4338ca;
                }
                .meal-type {
                    font-size: 24px;
                    margin: 0;
                    color: #4f46e5;
                }
                .nutrition {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin-bottom: 20px;
                    background-color: #f9fafb;
                    padding: 15px;
                    border-radius: 8px;
                }
                .nutrition-item {
                    flex: 1;
                    min-width: 100px;
                    padding: 10px;
                    background-color: white;
                    border-radius: 5px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    text-align: center;
                }
                .nutrition-value {
                    font-size: 22px;
                    font-weight: bold;
                    color: #4338ca;
                    margin: 0;
                }
                .nutrition-label {
                    font-size: 14px;
                    color: #6b7280;
                    margin: 0;
                }
                .section {
                    margin-bottom: 30px;
                }
                .section-title {
                    font-size: 22px;
                    margin-bottom: 15px;
                    color: #4338ca;
                }
                .ingredients-list, .instructions-list {
                    margin: 0;
                    padding-left: 20px;
                }
                .ingredients-list li, .instructions-list li {
                    margin-bottom: 8px;
                }
                .tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 20px;
                }
                .tag {
                    background-color: #e5e7eb;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 14px;
                    color: #4b5563;
                }
                .logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #4338ca;
                    text-align: center;
                    margin-bottom: 10px;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                    color: #6b7280;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="logo">TidyPlates</div>
            
            <div class="header">
                <h1 class="meal-name">${currentMeal.name}</h1>
                <h2 class="meal-type">${currentMeal.type}</h2>
            </div>
            
            <div class="nutrition">
                <div class="nutrition-item">
                    <p class="nutrition-value">${currentMeal.nutrition?.calories || 0}</p>
                    <p class="nutrition-label">Calories</p>
                </div>
                <div class="nutrition-item">
                    <p class="nutrition-value">${currentMeal.nutrition?.protein || 0}</p>
                    <p class="nutrition-label">Protein (g)</p>
                </div>
                <div class="nutrition-item">
                    <p class="nutrition-value">${currentMeal.nutrition?.carbs || 0}</p>
                    <p class="nutrition-label">Carbs (g)</p>
                </div>
                <div class="nutrition-item">
                    <p class="nutrition-value">${currentMeal.nutrition?.fat || 0}</p>
                    <p class="nutrition-label">Fats (g)</p>
                </div>
            </div>
            
            <div class="section">
                <h3 class="section-title">Ingredients</h3>
                <ul class="ingredients-list">
                    ${currentMeal.ingredients?.map(ing => 
                        `<li>${ing.name} ${ing.quantity ? `- ${ing.quantity}` : ''}</li>`
                    ).join('\n') || 'No ingredients available.'}
                </ul>
            </div>
            
            <div class="section">
                <h3 class="section-title">Instructions</h3>
                <ol class="instructions-list">
                    ${currentMeal.instructions?.map(instruction => 
                        `<li>${instruction}</li>`
                    ).join('\n') || 'No instructions available.'}
                </ol>
            </div>
            
            ${currentMeal.recipe?.details ? `
            <div class="section">
                <h3 class="section-title">Recipe Details</h3>
                <p>${currentMeal.recipe.details}</p>
            </div>
            ` : ''}
            
            ${currentMeal.tags && currentMeal.tags.length > 0 ? `
            <div class="tags">
                ${currentMeal.tags.map(tag => `<span class="tag">${tag}</span>`).join('\n')}
            </div>
            ` : ''}
            
            <div class="footer">
                <p>Generated by TidyPlates on ${new Date().toLocaleDateString()}</p>
            </div>
        </body>
        </html>
        `;
        
        // Create a Blob with the HTML content
        const blob = new Blob([htmlContent], { type: 'text/html' });
        
        // Create a URL for the blob
        const url = URL.createObjectURL(blob);
        
        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentMeal.type.toLowerCase()}-${currentMeal.name.toLowerCase().replace(/\s+/g, '-')}.html`;
        
        // Append to the DOM (required for Firefox)
        document.body.appendChild(a);
        
        // Trigger the download
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    };

    useEffect(() => {
        if (loggedIn === false) {
            navigate('/login');
        } else {
            navigate('/dashboard/planning');
        }
    }, []);

    useEffect(() => {
        // Fetch the current meal based on time of day when component mounts
        if (userID) {
            fetchCurrentMeal();
        }
    }, [userID]);
    
    // Initialize scaled nutrition whenever current meal changes
    useEffect(() => {
        if (currentMeal && currentMeal.nutrition) {
            setScaledNutrition({
                calories: currentMeal.nutrition.calories || 0,
                protein: currentMeal.nutrition.protein || 0,
                carbs: currentMeal.nutrition.carbs || 0,
                fat: currentMeal.nutrition.fat || 0
            });
            // Reset portion multiplier when meal changes
            setPortionMultiplier(1.0);
        }
    }, [currentMeal]);
    
    // We no longer need the daily nutrition calculation
    
    // Refresh meal data when user explicitly navigates to planning screen
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && userID) {
                fetchCurrentMeal();
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [userID]);

    // Function to determine meal type for a specific hour
    const getMealTypeForHour = (hour) => {
        if (hour >= 5 && hour < 11) {
            return "Breakfast";
        } else if (hour >= 11 && hour < 16) {
            return "Lunch";
        } else if (hour >= 16 && hour < 21) {
            return "Dinner";
        } else {
            return "Snack";
        }
    };
    
    // Get meal type based on current hour, with support for simulated hour
    const getMealTypeForCurrentTime = () => {
        const now = new Date();
        const hour = simulatedHour !== null ? simulatedHour : now.getHours();
        return getMealTypeForHour(hour);
    };
    
    // Function to simulate different times of day
    const simulateTimeOfDay = (mealType) => {
        let newHour;
        
        switch(mealType) {
            case "Breakfast":
                newHour = 8; // 8 AM
                break;
            case "Lunch":
                newHour = 13; // 1 PM
                break;
            case "Dinner":
                newHour = 18; // 6 PM
                break;
            case "Snack":
                newHour = 23; // 11 PM
                break;
            default:
                newHour = null; // Use actual time
        }
        
        // Set the simulated hour first
        setSimulatedHour(newHour);
        
        // Then immediately determine the meal type and fetch with the new time
        const updatedMealType = newHour !== null ? getMealTypeForHour(newHour) : getMealTypeForCurrentTime();
        
        // Fetch the meal based on the new simulated time
        fetchCurrentMeal(updatedMealType);
    };

    // Fetch the current meal plan and find the appropriate meal for current time
    const fetchCurrentMeal = async (forcedMealType) => {
        try {
            setIsLoading(true);
            setError(null);
            
            // First fetch user's meal plans
            const response = await fetch(`/api/account/mealplan/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID }),
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch meal plans: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log("Response from meal plan API:", data);
            
            if (data.status === 200 && data.mealPlans && data.mealPlans.length > 0) {
                // Get the first meal plan (most recent)
                const latestPlanID = data.mealPlans[0].planID;
                
                // Now fetch the meals for this plan
                const mealsResponse = await fetch(`/api/account/meals/?planID=${latestPlanID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    signal: AbortSignal.timeout(10000)
                });
                
                if (!mealsResponse.ok) {
                    throw new Error(`Failed to fetch meals for plan: ${mealsResponse.status} ${mealsResponse.statusText}`);
                }
                
                const mealsData = await mealsResponse.json();
                if (mealsData.status === 200 && mealsData.meals && mealsData.meals.length > 0) {
                    // Get current meal type based on time of day or use forced meal type if provided
                    const currentMealType = forcedMealType || getMealTypeForCurrentTime();
                    
                    // Find a meal matching the current meal type
                    const matchingMeal = mealsData.meals.find(meal => {
                        const hour = parseInt(meal.mealTime.split(':')[0], 10);
                        let type;
                        
                        if (hour >= 5 && hour < 11) {
                            type = "Breakfast";
                        } else if (hour >= 11 && hour < 16) {
                            type = "Lunch";
                        } else if (hour >= 16 && hour < 21) {
                            type = "Dinner";
                        } else {
                            type = "Snack";
                        }
                        
                        return type === currentMealType;
                    });
                    
                    if (matchingMeal) {
                        // Format the meal for display
                        const mealName = matchingMeal.mealName || "Default Meal";
                        let imageName = mealName.replace(/ /g, ' ');
                        let mealPath = getMealImagePath(imageName);
                        
                        // Format ingredients to have consistent name/quantity structure
                        const formattedIngredients = Array.isArray(matchingMeal.ingredients) 
                            ? matchingMeal.ingredients.map(ing => {
                                // If ingredient already has name/quantity properties, use those
                                if (ing.name && ing.quantity) {
                                    return ing;
                                }
                                // If ingredient has ingredientName/ingredientQuantity properties (from API)
                                else if (ing.ingredientName || ing.ingredientQuantity) {
                                    return {
                                        name: ing.ingredientName || 'Unknown ingredient',
                                        quantity: ing.ingredientQuantity || ''
                                    };
                                }
                                // If ingredient is a string or another format
                                else if (typeof ing === 'string') {
                                    return { name: ing, quantity: '' };
                                }
                                // Default case
                                else {
                                    return { 
                                        name: ing.toString ? ing.toString() : 'Unknown ingredient', 
                                        quantity: '' 
                                    };
                                }
                            })
                            : [];
                            
                        // Extract recipe and instructions
                        const recipeInstructions = matchingMeal.recipe?.instructions || [];
                        
                        // Create formatted instructions from either recipe instructions or matchingMeal.instructions
                        const formattedInstructions = Array.isArray(recipeInstructions) && recipeInstructions.length > 0 
                            ? recipeInstructions 
                            : matchingMeal.instructions || [];
                            
                        // Get recipe details
                        const recipeDetails = matchingMeal.recipe?.recipeDetails || matchingMeal.recipe?.recipeDescription || '';
                        
                        setCurrentMeal({
                            mealID: matchingMeal.mealID,
                            name: mealName,
                            type: currentMealType,
                            image: mealPath,
                            ingredients: formattedIngredients,
                            instructions: formattedInstructions,
                            recipe: {
                                details: recipeDetails,
                                instructions: formattedInstructions
                            },
                            nutrition: matchingMeal.nutrition || { 
                                calories: 450, 
                                protein: 20, 
                                carbs: 40, 
                                fat: 10 
                            },
                            tags: matchingMeal.mealTags ? matchingMeal.mealTags.split(',') : ['Healthy']
                        });
                    } else {
                        // No matching meal found, use a placeholder
                        loadPlaceholderMeal(currentMealType);
                    }
                } else {
                    // No meals found, use a placeholder
                    loadPlaceholderMeal(forcedMealType || getMealTypeForCurrentTime());
                }
            } else {
                // No meal plans found, use a placeholder
                loadPlaceholderMeal(forcedMealType || getMealTypeForCurrentTime());
            }
        } catch (err) {
            console.error('Error fetching current meal:', err);
            setError(err.message || 'Failed to fetch meal data. Please try again later.');
            // Fallback to placeholder data
            loadPlaceholderMeal(forcedMealType || getMealTypeForCurrentTime());
        } finally {
            setIsLoading(false);
        }
    };
    
    const loadPlaceholderMeal = (mealType) => {
        // Create a placeholder meal based on the meal type
        const placeholderMeals = {
            Breakfast: {
                mealID: 'placeholder-breakfast',
                name: 'Oatmeal with Berries',
                type: 'Breakfast',
                image: getMealImagePath('Oatmeal with Banana and Berries'),
                ingredients: [
                    { name: 'Rolled oats', quantity: '1 cup' },
                    { name: 'Milk', quantity: '2 cups' },
                    { name: 'Mixed berries', quantity: '1/2 cup' },
                    { name: 'Honey', quantity: '1 tbsp' },
                    { name: 'Cinnamon', quantity: '1/2 tsp' }
                ],
                instructions: [
                    'Combine oats and milk in a pot and bring to a simmer.',
                    'Cook for 5 minutes, stirring occasionally.',
                    'Remove from heat and add berries, honey, and cinnamon.',
                    'Let stand for 2 minutes before serving.'
                ],
                recipe: {
                    details: 'This simple oatmeal recipe is perfect for a nutritious breakfast. Steel-cut oats provide long-lasting energy and the berries add natural sweetness and antioxidants. You can substitute any type of milk, including plant-based alternatives like almond or oat milk.',
                    instructions: [
                        'Combine oats and milk in a pot and bring to a simmer.',
                        'Cook for 5 minutes, stirring occasionally.',
                        'Remove from heat and add berries, honey, and cinnamon.',
                        'Let stand for 2 minutes before serving.'
                    ]
                },
                nutrition: { calories: 320, protein: 12, carbs: 45, fat: 8 },
                tags: ['Vegetarian', 'High Fiber']
            },
            Lunch: {
                mealID: 'placeholder-lunch',
                name: 'Quinoa Bowl with Roasted Vegetables',
                type: 'Lunch',
                image: getMealImagePath('Quinoa Bowl with Chickpeas and Vegetables'),
                ingredients: [
                    { name: 'Quinoa', quantity: '1 cup' },
                    { name: 'Sweet potato', quantity: '1 medium' },
                    { name: 'Chickpeas', quantity: '1 can' },
                    { name: 'Broccoli', quantity: '2 cups' },
                    { name: 'Olive oil', quantity: '2 tbsp' },
                    { name: 'Tahini', quantity: '2 tbsp' },
                    { name: 'Lemon juice', quantity: '1 tbsp' }
                ],
                instructions: [
                    'Rinse quinoa thoroughly and cook according to package instructions with a pinch of salt.',
                    'Preheat oven to 400°F (200°C). Cut sweet potatoes into 1-inch cubes, toss with olive oil and roast for 25 minutes.',
                    'Drain and rinse chickpeas, season with spices, and roast for 20 minutes until crispy.'
                ],
                recipe: {
                    details: 'This protein-packed quinoa bowl combines nutrient-dense ingredients for a perfectly balanced lunch. Quinoa provides complete plant protein while roasted vegetables add fiber and essential vitamins. The tahini sauce brings healthy fats and a creamy texture to tie everything together.',
                    instructions: [
                        'Rinse quinoa thoroughly and cook according to package instructions with a pinch of salt.',
                        'Preheat oven to 400°F (200°C). Cut sweet potatoes into 1-inch cubes, toss with olive oil and roast for 25 minutes.',
                        'Drain and rinse chickpeas, season with spices, and roast for 20 minutes until crispy.',
                        'Combine all ingredients in a bowl and drizzle with tahini lemon sauce.'
                    ]
                },
                nutrition: { calories: 450, protein: 20, carbs: 60, fat: 15 },
                tags: ['Vegan', 'High Protein', 'Veg']
            },
            Dinner: {
                mealID: 'placeholder-dinner',
                name: 'Baked Salmon with Roasted Vegetables',
                type: 'Dinner',
                image: getMealImagePath('Baked Salmon with Roasted Vegetables'),
                ingredients: [
                    { name: 'Salmon fillet', quantity: '6 oz' },
                    { name: 'Asparagus', quantity: '1 bunch' },
                    { name: 'Cherry tomatoes', quantity: '1 cup' },
                    { name: 'Olive oil', quantity: '1 tbsp' },
                    { name: 'Lemon', quantity: '1' },
                    { name: 'Garlic', quantity: '2 cloves' },
                    { name: 'Fresh dill', quantity: '2 tbsp' }
                ],
                instructions: [
                    'Preheat oven to 375°F (190°C).',
                    'Place salmon on a baking sheet lined with parchment paper.',
                    'Toss asparagus and cherry tomatoes with olive oil, salt, and pepper.',
                    'Arrange vegetables around the salmon.',
                    'Squeeze lemon juice over everything and add minced garlic.',
                    'Bake for 15-20 minutes until salmon is cooked through.'
                ],
                recipe: {
                    details: ```This sheet pan salmon dinner offers omega-3 fatty acids and lean protein with minimal cleanup. The fresh dill and lemon brighten the dish, while the roasted vegetables provide fiber and essential nutrients. This meal is keto-friendly and perfect for a nutritious dinner option that's ready in under 30 minutes.```,
                    instructions: [
                        'Preheat oven to 375°F (190°C).',
                        'Place salmon on a baking sheet lined with parchment paper.',
                        'Toss asparagus and cherry tomatoes with olive oil, salt, and pepper.',
                        'Arrange vegetables around the salmon.',
                        'Squeeze lemon juice over everything and add minced garlic.',
                        'Sprinkle fresh dill over the salmon.',
                        'Bake for 15-20 minutes until salmon is cooked through and flakes easily with a fork.'
                    ]
                },
                nutrition: { calories: 520, protein: 40, carbs: 25, fat: 28 },
                tags: ['High Protein', 'Omega-3', 'Keto-Friendly']
            },
            Snack: {
                mealID: 'placeholder-snack',
                name: 'Greek Yogurt with Fruit',
                type: 'Snack',
                image: getMealImagePath('Greek Yogurt with Fruit and Granola'),
                ingredients: [
                    { name: 'Greek yogurt', quantity: '1 cup' },
                    { name: 'Mixed berries', quantity: '1/2 cup' },
                    { name: 'Honey', quantity: '1 tsp' },
                    { name: 'Granola', quantity: '2 tbsp' }
                ],
                instructions: [
                    'Add Greek yogurt to a bowl.',
                    'Top with mixed berries.',
                    'Drizzle with honey and sprinkle with granola.'
                ],
                recipe: {
                    details: 'This Greek yogurt snack provides a perfect balance of protein and carbohydrates, making it ideal for post-workout recovery or as a midday energy boost. The probiotics in Greek yogurt support gut health, while berries add antioxidants and granola provides satisfying crunch and fiber.',
                    instructions: [
                        'Add Greek yogurt to a bowl.',
                        'Top with mixed berries.',
                        'Drizzle with honey and sprinkle with granola.',
                        'For a dairy-free version, substitute with coconut yogurt.'
                    ]
                },
                nutrition: { calories: 180, protein: 15, carbs: 20, fat: 5 },
                tags: ['High Protein', 'Quick']
            }
        };
        
        // Get the appropriate meal for the meal type, or fall back to Lunch if type not found
        const selectedMeal = placeholderMeals[mealType] || placeholderMeals['Lunch'];
        
        // Set the meal to state
        setCurrentMeal(selectedMeal);
    };


    return (
        <div className='overflow-y-auto h-full p-6 grow flex flex-col item-center gap-6'>
            {isLoading ? (
                <div className='flex justify-center items-center h-full'>
                    <p className='text-2xl font-semibold'>Loading your meal...</p>
                </div>
            ) : error ? (
                <div className='flex justify-center items-center h-full'>
                    <p className='text-xl text-red-500'>{error}</p>
                </div>
            ) : currentMeal ? (
                <>
                    <div className='bg-gray-200 flex flex-col gap-8 rounded-md p-6'>
                        <div className='flex items-center justify-between gap-4'>
                            <h1 className='text-4xl font-bold'>{currentMeal.name}</h1>
                            <div className='flex items-center gap-4'>
                                <button 
                                    onClick={fetchCurrentMeal} 
                                    className='bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-1 text-sm transition-all'>
                                    Refresh
                                </button>
                                <h1 className='text-4xl font-bold pr-4'>{currentMeal.type}</h1>
                            </div>
                        </div>
                        
                        {/* Time simulation controls */}
                        {process.env.NODE_ENV !== 'production' && (
                            <div className='bg-gray-100 rounded-md p-3 border border-gray-300'>
                                <div className='flex items-center gap-4'>
                                    <h2 className='text-sm font-medium'>Simulate time of day:</h2>
                                    <div className='flex gap-2'>
                                        <button
                                            onClick={() => simulateTimeOfDay("Breakfast")}
                                            className={`px-3 py-1 rounded text-sm ${simulatedHour === 8 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            Breakfast
                                        </button>
                                        <button
                                            onClick={() => simulateTimeOfDay("Lunch")}
                                            className={`px-3 py-1 rounded text-sm ${simulatedHour === 13 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            Lunch
                                        </button>
                                        <button
                                            onClick={() => simulateTimeOfDay("Dinner")}
                                            className={`px-3 py-1 rounded text-sm ${simulatedHour === 18 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            Dinner
                                        </button>
                                        <button
                                            onClick={() => simulateTimeOfDay("Snack")}
                                            className={`px-3 py-1 rounded text-sm ${simulatedHour === 23 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            Snack
                                        </button>
                                        <button
                                            onClick={() => simulateTimeOfDay("")}
                                            className={`px-3 py-1 rounded text-sm ${simulatedHour === null ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            Actual Time
                                        </button>
                                    </div>
                                    <div className='ml-auto text-xs text-gray-500'>
                                        {simulatedHour !== null ? `Simulating: ${simulatedHour}:00` : 'Using actual time'}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className='flex items-center justify-start gap-10'>
                            <div className='h-60 w-96 bg-slate-200'>
                                <img src={currentMeal.image} alt={`${currentMeal.name} meal`} className='w-full h-full rounded-md object-cover' />
                            </div>
                            <div className='flex flex-col gap-7 h-60 justify-start'>
                                <p>
                                    {currentMeal.description || `A delicious ${currentMeal.type.toLowerCase()} featuring ${currentMeal.name}. This balanced meal is perfect for ${currentMeal.type === 'Breakfast' ? 'starting your day' : currentMeal.type === 'Lunch' ? 'midday energy' : currentMeal.type === 'Dinner' ? 'evening satisfaction' : 'a nutritious boost'}.`}
                                </p>

                                <div className='nutrition-flags flex items-center gap-10'>
                                    <div className='flex flex-col items-center justify-center w-24 h-14 bg-white rounded-md nav-icon-shadow hover:scale-110 transition-all ease-in-out'>
                                        <h1 className='font-bold text-indigo-500'>{currentMeal.nutrition?.calories || 0}</h1>
                                        <h1 className='text-black/30 font-bold text-sm'>Calories</h1>
                                    </div>
                                    <div className='flex flex-col items-center justify-center w-24 h-14 bg-white rounded-md nav-icon-shadow hover:scale-110 transition-all ease-in-out'>
                                        <h1 className='font-bold text-indigo-500'>{currentMeal.nutrition?.protein || 0}</h1>
                                        <h1 className='text-black/30 font-bold text-sm'>Protein</h1>
                                    </div>
                                    <div className='flex flex-col items-center justify-center w-24 h-14 bg-white rounded-md nav-icon-shadow hover:scale-110 transition-all ease-in-out'>
                                        <h1 className='font-bold text-indigo-500'>{currentMeal.nutrition?.carbs || 0}</h1>
                                        <h1 className='text-black/30 font-bold text-sm'>Carbs</h1>
                                    </div>
                                    <div className='flex flex-col items-center justify-center w-24 h-14 bg-white rounded-md nav-icon-shadow hover:scale-110 transition-all ease-in-out'>
                                        <h1 className='font-bold text-indigo-500'>{currentMeal.nutrition?.fat || 0}</h1>
                                        <h1 className='text-black/30 font-bold text-sm'>Fats</h1>
                                    </div>
                                </div>

                                <div className='flex items-center justify-start gap-6'>
                                    <button className='bg-white hover:bg-gray-200 active:bg-gray-300 rounded-lg w-36 h-10 flex justify-center items-center gap-2 cursor-pointer transition-all ease-in-out'>
                                        <FavoriteBorderOutlinedIcon color='black' fontSize='small' />
                                        <h1 className='text-sm font-semibold'>Save Recipe</h1>
                                    </button>
                                    <button 
                                        onClick={handleDownload}
                                        className='bg-white hover:bg-gray-200 active:bg-gray-300 rounded-lg w-36 h-10 flex justify-center items-center gap-2 cursor-pointer transition-all ease-in-out'
                                    >
                                        <FileDownloadOutlinedIcon color='black' fontSize='small' />
                                        <h1 className='text-sm font-semibold'>Download</h1>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className='flex items-center justify-start gap-4'>
                                {currentMeal.tags && currentMeal.tags.map((tag, index) => (
                                    <div key={index} className='flex flex-col items-center justify-center h-8 px-6 bg-white rounded-full nav-icon-shadow hover:scale-105 transition-all ease-in-out'>
                                        <h1 className='text-black/70 font-semibold text-sm'>{tag}</h1>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center justify-between gap-8'>
                        <div className='w-[30rem] h-[22rem] rounded-md bg-gray-200 py-4 px-7 flex flex-col gap-4 justify-center'>
                            <h1 className='text-2xl font-semibold'>Ingredients</h1>
                            <div className='w-full h-[14rem] flex flex-col gap-2 overflow-y-auto px-1 custom-scrollbar'>
                                {currentMeal.ingredients && currentMeal.ingredients.map((ingredient, index) => (
                                    <IngredientItem 
                                        key={index} 
                                        item={ingredient.name || ingredient} 
                                        quantity={ingredient.quantity || ''}
                                    />
                                ))}
                                {(!currentMeal.ingredients || currentMeal.ingredients.length === 0) && (
                                    <p className='italic text-gray-500'>No ingredients available for this meal.</p>
                                )}
                            </div>

                            <button className='bg-gray-400 hover:bg-gray-400/70 active:bg-gray-400/90 flex items-center justify-center gap-2 rounded-lg w-64 h-10 cursor-pointer transition-all ease-in-out mx-auto'>
                                <ShoppingCartOutlinedIcon className='text-black/70' fontSize='small' />
                                <h1>Generate Grocery List</h1>
                            </button>
                        </div>

                        <div className='w-full h-[22rem] rounded-md bg-gray-200 py-4 px-7 flex flex-col gap-4 justify-center'>
                            <h1 className='text-2xl font-semibold'>Cooking Instructions</h1>
                            <div className='h-full flex flex-col item-center gap-3 overflow-y-auto custom-scrollbar'>
                                {currentMeal.instructions && currentMeal.instructions.map((instruction, index) => (
                                    <InstructionsItem 
                                        key={index} 
                                        listNumber={index + 1} 
                                        instruction={instruction}
                                    />
                                ))}
                                {(!currentMeal.instructions || currentMeal.instructions.length === 0) && (
                                    <p className='italic text-gray-500'>No cooking instructions available for this meal.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recipe Details Section */}
                    <div className='bg-gray-200 rounded-md py-4 px-7 flex flex-col gap-4'>
                        <h1 className='text-2xl font-semibold'>Recipe Details</h1>
                        <div className='p-4 bg-white/80 rounded-md'>
                            {currentMeal.recipe?.details ? (
                                <p className='text-gray-700 whitespace-pre-line'>{currentMeal.recipe.details}</p>
                            ) : (
                                <p className='text-gray-500 italic'>No recipe details available for this meal.</p>
                            )}
                        </div>
                    </div>

                    <div className='bg-gray-200 rounded-md py-4 px-7 flex flex-col gap-4 justify-center'>
                        <h1 className='text-2xl font-semibold'>Customizations</h1>
                        <div className='flex items-center justify-center gap-60 flex-wrap'>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className='bg-white/90 hover:bg-white/70 active:bg-gray-400/60 flex items-center justify-center gap-2 rounded-lg w-64 h-10 cursor-pointer transition-all ease-in-out'>
                                        <AutoFixNormalOutlinedIcon color='black' fontSize='small' />
                                        <h1>Generate Similar Recipe</h1>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Generate Similar Recipe</DialogTitle>
                                        <DialogDescription>
                                            Find a similar alternative to {currentMeal.name} with comparable nutritional profile.
                                        </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="flex flex-col gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="font-medium mb-2">Dietary Preferences</h3>
                                                <Select 
                                                    value={dietaryPreference}
                                                    onValueChange={setDietaryPreference}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select preference" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">No restrictions</SelectItem>
                                                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                                        <SelectItem value="vegan">Vegan</SelectItem>
                                                        <SelectItem value="glutenFree">Gluten-free</SelectItem>
                                                        <SelectItem value="dairyFree">Dairy-free</SelectItem>
                                                        <SelectItem value="nutFree">Nut-free</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            
                                            <div>
                                                <h3 className="font-medium mb-2">Meal Type</h3>
                                                <Select defaultValue={currentMeal.type.toLowerCase()}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select meal type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="breakfast">Breakfast</SelectItem>
                                                        <SelectItem value="lunch">Lunch</SelectItem>
                                                        <SelectItem value="dinner">Dinner</SelectItem>
                                                        <SelectItem value="snack">Snack</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h3 className="font-medium mb-2">Ingredients to Include</h3>
                                            <Input 
                                                placeholder="E.g. chicken, broccoli (optional)"
                                                value={includedIngredients}
                                                onChange={(e) => setIncludedIngredients(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div>
                                            <h3 className="font-medium mb-2">Ingredients to Exclude</h3>
                                            <Input
                                                placeholder="E.g. onions, peppers (optional)"
                                                value={excludedIngredients}
                                                onChange={(e) => setExcludedIngredients(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button 
                                                onClick={generateSimilarRecipe}
                                                className="bg-indigo-700 hover:bg-indigo-800"
                                                disabled={generatingRecipe}
                                            >
                                                {generatingRecipe ? (
                                                    <>
                                                        <span className="animate-spin mr-2">⟳</span> 
                                                        Generating...
                                                    </>
                                                ) : (
                                                    'Generate Recipe'
                                                )}
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className='bg-white/90 hover:bg-white/70 active:bg-gray-400/60 flex items-center justify-center gap-2 rounded-lg w-64 h-10 cursor-pointer transition-all ease-in-out'>
                                        <BrushOutlinedIcon color='black' fontSize='small' />
                                        <h1>Change portion size</h1>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Change Portion Size</DialogTitle>
                                        <DialogDescription>
                                            Adjust the portion size for {currentMeal.name}. This will scale the ingredients and nutrition accordingly.
                                        </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="flex flex-col gap-4 py-4">
                                        <div>
                                            <h3 className="font-medium mb-2">Portion Multiplier</h3>
                                            <div className="flex items-center gap-3">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => updatePortionSize(-0.25)}
                                                    disabled={portionMultiplier <= 0.25}
                                                >
                                                    -
                                                </Button>
                                                <div className="w-full text-center bg-slate-100 py-2 rounded-md font-medium">
                                                    {portionMultiplier.toFixed(2)}x
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => updatePortionSize(0.25)}
                                                    disabled={portionMultiplier >= 4}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <div className="border-t pt-4">
                                            <h3 className="font-medium mb-2">Updated Nutritional Information</h3>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Calories:</span>
                                                    <span className="font-medium">{scaledNutrition.calories} kcal</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Protein:</span>
                                                    <span className="font-medium">{scaledNutrition.protein}g</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Carbs:</span>
                                                    <span className="font-medium">{scaledNutrition.carbs}g</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Fats:</span>
                                                    <span className="font-medium">{scaledNutrition.fat}g</span>
                                                </div>
                                            </div>
                                            
                                            {portionMultiplier !== 1.0 && (
                                                <div className="mt-4 text-sm">
                                                    <span className="text-amber-700 font-medium">Note:</span> Ingredient quantities will be scaled proportionally.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button 
                                                onClick={applyPortionSizeChange}
                                                className="bg-indigo-700 hover:bg-indigo-800"
                                                disabled={portionMultiplier === 1.0}
                                            >
                                                Update Portion Size
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </>
            ) : (
                <div className='flex flex-col justify-center items-center h-full gap-4'>
                    <p className='text-xl'>No meal found for the current time. Try refreshing or generate new meal plans.</p>
                    <div className='flex flex-row gap-4'>
                        <button 
                            onClick={fetchCurrentMeal}
                            className='bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-6 py-2 transition-all'>
                            Refresh Meal
                        </button>
                        <button 
                            onClick={generateNewMealPlans}
                            className='bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-2 transition-all'>
                            Generate New Meal Plans
                        </button>
                    </div>
                    
                    {/* Time simulation controls for empty state */}
                    {process.env.NODE_ENV !== 'production' && (
                        <div className='mt-4 bg-gray-100 rounded-md p-3 border border-gray-300 w-full max-w-xl'>
                            <div className='flex flex-col gap-2'>
                                <h2 className='text-sm font-medium'>Try simulating a different time of day:</h2>
                                <div className='flex justify-center gap-2 flex-wrap'>
                                    <button
                                        onClick={() => simulateTimeOfDay("Breakfast")}
                                        className={`px-3 py-1 rounded text-sm ${simulatedHour === 8 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        Breakfast (8 AM)
                                    </button>
                                    <button
                                        onClick={() => simulateTimeOfDay("Lunch")}
                                        className={`px-3 py-1 rounded text-sm ${simulatedHour === 13 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        Lunch (1 PM)
                                    </button>
                                    <button
                                        onClick={() => simulateTimeOfDay("Dinner")}
                                        className={`px-3 py-1 rounded text-sm ${simulatedHour === 18 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        Dinner (6 PM)
                                    </button>
                                    <button
                                        onClick={() => simulateTimeOfDay("Snack")}
                                        className={`px-3 py-1 rounded text-sm ${simulatedHour === 23 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        Snack (11 PM)
                                    </button>
                                    <button
                                        onClick={() => simulateTimeOfDay("")}
                                        className={`px-3 py-1 rounded text-sm ${simulatedHour === null ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        Use Actual Time
                                    </button>
                                </div>
                                <div className='text-xs text-center text-gray-500 mt-1'>
                                    {simulatedHour !== null ? `Currently simulating: ${simulatedHour}:00` : 'Using actual time'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default PlanningScreen