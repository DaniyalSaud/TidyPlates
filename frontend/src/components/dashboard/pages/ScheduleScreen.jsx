import React, { useContext, useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PlanningMealCard from '../components/PlanningMealCard';
import TodayMacro from '../components/TodayMacro';
import { GlassContext } from '@/contexts/hydrationContext';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { LoggedInContext, UserIDContext } from '@/contexts/loginContext';
import { getMealImagePath } from '@/lib/utils';

function ScheduleScreen() {
    const navigate = useNavigate();
    const { loggedIn } = useContext(LoggedInContext);
    const { userID } = useContext(UserIDContext);
    const [mealPlans, setMealPlans] = useState([]);
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
    const [filteredMeals, setFilteredMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateToMealPlanMap, setDateToMealPlanMap] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [nutrition, setNutrition] = useState({
        protein: 0,
        carbs: 0,
        fats: 0,
        calories: 0
    });
    
    useEffect(() => {
        if (loggedIn === false) {
            navigate('/login');
        } else {
            navigate('/dashboard/schedule');
        }
    }, []);
    
    // Fetch meal plans when component mounts
    useEffect(() => {
        if (userID) {
            fetchMealPlans();
        }
    }, [userID]);
    
    const getTodayDayName = () => {
        const date = new Date();
        const options = { weekday: 'long' };
        return date.toLocaleDateString('en-US', options).toLowerCase();
    }

    // Get date for a specific day of the week relative to current week
    const getDateForDay = (dayName) => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date(currentDate);
        const currentDayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const targetDayIndex = days.indexOf(dayName.toLowerCase());
        
        if (targetDayIndex === -1) return today; // Invalid day name
        
        // Calculate the difference in days
        let diff = targetDayIndex - currentDayIndex;
        
        // Create a new date for the target day
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);
        
        return targetDate;
    }
    
    // Format date in YYYY-MM-DD format for database comparison
    const formatDateForDB = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const getGlassPercentage = (glasses) => {
        const maxGlasses = 10; // Assuming 10 glasses is the maximum for a day
        return (glasses / maxGlasses) * 100;
    }
    
    // Format date for display
    const formatPlanDate = (dateStr) => {
        if (!dateStr) return "No date";
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        } catch (err) {
            console.error('Error parsing date:', err);
            return "Invalid date";
        }
    };

    const [selectedDay, setSelectedDay] = useState(getTodayDayName());
    const glasses = useContext(GlassContext).glasses;
    
    // Function to calculate total nutrition from meals
    const calculateTotalNutrition = (meals) => {
        const total = {
            protein: 0,
            carbs: 0,
            fats: 0,
            calories: 0
        };
        
        meals.forEach(meal => {
            if (meal.nutrition) {
                total.protein += meal.nutrition.protein || 0;
                total.carbs += meal.nutrition.carbs || 0;
                total.fats += meal.nutrition.fat || 0; // Note: DB uses 'fat' not 'fats'
                total.calories += meal.nutrition.calories || 0;
            }
        });
        
        setNutrition(total);
    };
    
    // Function to fetch meal plans
    const fetchMealPlans = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Make API call to get user's meal plans
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
                // Sort meal plans by date (newest first)
                const sortedMealPlans = [...data.mealPlans].sort((a, b) => {
                    return new Date(b.planDate) - new Date(a.planDate);
                });
                
                setMealPlans(sortedMealPlans);
                setSelectedPlanIndex(0); // Select the newest plan by default
                
                // Create a mapping between dates and meal plans
                const dateMap = {};
                sortedMealPlans.forEach(plan => {
                    if (plan.planDate) {
                        dateMap[plan.planDate] = plan;
                    }
                });
                
                setDateToMealPlanMap(dateMap);
                
                // Get the date for the selected day and find the corresponding meal plan
                const selectedDate = formatDateForDB(getDateForDay(selectedDay));
                const matchingPlan = sortedMealPlans.find(plan => plan.planDate === selectedDate) || sortedMealPlans[0];
                
                // Fetch meals for the matching plan and filter by selected day
                await fetchMealsForPlan(matchingPlan.planID, selectedDay);
            } else {
                // No meal plans found
                setFilteredMeals([]);
                setNutrition({ protein: 0, carbs: 0, fats: 0, calories: 0 });
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Error fetching meal plans:', err);
            setError(err.message || 'Failed to fetch meal plan data. Please try again later.');
            setIsLoading(false);
            // Use placeholder data if needed
            loadPlaceholderMeals();
        }
    };
    
    // Function to fetch meals for a specific plan
    const fetchMealsForPlan = async (planID, dayName) => {
        try {
            const mealsResponse = await fetch(`/api/account/meals/?planID=${planID}`, {
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
                // Find the meal plan object to get its date
                const currentPlan = mealPlans.find(plan => plan.planID === planID);
                const planDate = currentPlan?.planDate ? new Date(currentPlan.planDate) : null;
                
                // Format meals for display
                const formattedMeals = mealsData.meals.map(meal => {
                    // Determine meal type based on timeToEat
                    const timeToEat = meal.mealTime;
                    let type = "Meal";
                    
                    const hour = parseInt(timeToEat.split(':')[0], 10);
                    
                    if (hour >= 5 && hour < 11) {
                        type = "Breakfast";
                    } else if (hour >= 11 && hour < 16) {
                        type = "Lunch";
                    } else if (hour >= 16 && hour < 21) {
                        type = "Dinner";
                    } else {
                        type = "Snack";
                    }
                    
                    // Get image path based on meal name or use default
                    const mealName = meal.mealName || "Default Meal";
                    let imageName = mealName.replace(/ /g, ' ');
                    let mealPath = getMealImagePath(imageName);
                    
                    // Determine day based on meal data, plan date, or distribution logic
                    let mealDayName = meal.dayName;
                    
                    // If meal has a date, use it to determine the day
                    if (!mealDayName && meal.date) {
                        mealDayName = getDayNameFromDate(meal.date);
                    }
                    
                    // If we have a plan date, assign days based on that
                    if (!mealDayName && planDate) {
                        // If we have a meal plan date, we can calculate days relative to it
                        const mealIndex = meal.mealID % 7; // Use meal ID to distribute across the week
                        const mealDate = new Date(planDate);
                        mealDate.setDate(planDate.getDate() + mealIndex);
                        mealDayName = getDayNameFromDate(mealDate);
                    }
                    
                    // If still no day, distribute evenly
                    if (!mealDayName) {
                        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                        mealDayName = days[meal.mealID % days.length];
                    }
                    
                    return {
                        id: meal.mealID,
                        type,
                        mealName,
                        mealPath,
                        mealTime: meal.mealTime,
                        mealNutrition: `${meal.nutrition ? meal.nutrition.calories : "?"} Cal | ${meal.nutrition ? meal.nutrition.protein : "?"} g Protein`,
                        cookTime: meal.cookTime || "30 min",
                        nutrition: meal.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 },
                        dayName: mealDayName.toLowerCase(),
                        planID: planID  // Track which plan this meal belongs to
                    };
                });
                
                // Ensure we have meals for all days of the week by distributing them if necessary
                const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                const mealsByDay = {};
                
                // Initialize empty arrays for each day
                days.forEach(day => {
                    mealsByDay[day] = [];
                });
                
                // Group meals by day
                formattedMeals.forEach(meal => {
                    const day = meal.dayName.toLowerCase();
                    if (days.includes(day)) {
                        mealsByDay[day].push(meal);
                    } else {
                        // If day is invalid, assign to a day with fewer meals
                        const dayWithFewestMeals = days.reduce((minDay, currentDay) => 
                            (mealsByDay[currentDay].length < mealsByDay[minDay].length) ? currentDay : minDay
                        , days[0]);
                        
                        meal.dayName = dayWithFewestMeals;
                        mealsByDay[dayWithFewestMeals].push(meal);
                    }
                });
                
                // Filter meals by selected day
                const mealsForSelectedDay = mealsByDay[dayName.toLowerCase()] || [];
                
                // If no meals for this day in this plan, show a message
                if (mealsForSelectedDay.length === 0) {
                    console.log(`No meals found for ${dayName} in plan ${planID}`);
                }
                
                setFilteredMeals(mealsForSelectedDay);
                
                // Calculate nutrition for the filtered meals
                calculateTotalNutrition(mealsForSelectedDay);
            } else {
                // No meals found
                setFilteredMeals([]);
                setNutrition({ protein: 0, carbs: 0, fats: 0, calories: 0 });
            }
            
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching meals:', err);
            setError(err.message || 'Failed to fetch meal data. Please try again later.');
            setIsLoading(false);
            // Use placeholder data if needed
            loadPlaceholderMeals(dayName);
        }
    };
    
    // Function to get day name from date
    const getDayNameFromDate = (dateStr) => {
        if (!dateStr) return null;
        
        try {
            const date = new Date(dateStr);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                console.warn(`Invalid date string: ${dateStr}`);
                return null;
            }
            
            const options = { weekday: 'long' };
            return date.toLocaleDateString('en-US', options).toLowerCase();
        } catch (err) {
            console.error('Error parsing date:', err);
            return null;
        }
    };
    
    // Function to handle day selection change
    const handleDayChange = (day) => {
        setSelectedDay(day);
        
        if (mealPlans.length > 0) {
            // Get the date for the selected day
            const selectedDate = formatDateForDB(getDateForDay(day));
            console.log(`Looking for meal plan for date: ${selectedDate}`);
            
            // Find the meal plan for the selected date
            const matchingPlan = mealPlans.find(plan => plan.planDate === selectedDate);
            
            if (matchingPlan) {
                console.log(`Found matching meal plan: ${matchingPlan.planID} for date ${selectedDate}`);
                // Update the selected plan index
                const newIndex = mealPlans.findIndex(p => p.planID === matchingPlan.planID);
                if (newIndex !== -1) {
                    setSelectedPlanIndex(newIndex);
                }
                
                // Fetch meals for the matching plan
                fetchMealsForPlan(matchingPlan.planID, day);
            } else {
                console.log(`No matching meal plan found for date ${selectedDate}, using selected plan`);
                // If no matching plan, use the currently selected plan
                fetchMealsForPlan(mealPlans[selectedPlanIndex].planID, day);
            }
        } else {
            // No meal plans, just load placeholders for the selected day
            loadPlaceholderMeals(day);
        }
    };
    
    // Function to handle meal plan selection change
    const handlePlanChange = (index) => {
        setSelectedPlanIndex(index);
        
        if (mealPlans.length > 0) {
            // Load meals for the selected plan and day
            fetchMealsForPlan(mealPlans[index].planID, selectedDay);
            
            // Update the current date based on the plan date
            if (mealPlans[index].planDate) {
                setCurrentDate(new Date(mealPlans[index].planDate));
            }
        }
    };
    
    // Fallback function to load placeholder meals for the selected day
    const loadPlaceholderMeals = (day = selectedDay) => {
        const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        // Base meal templates
        const baseMeals = {
            breakfast: {
                type: 'Breakfast',
                mealTime: '08:00',
                cookTime: '15 min'
            },
            lunch: {
                type: 'Lunch',
                mealTime: '13:00',
                cookTime: '25 min'
            },
            dinner: {
                type: 'Dinner',
                mealTime: '19:00',
                cookTime: '30 min'
            },
            snack: {
                type: 'Snack',
                mealTime: '22:00',
                cookTime: '5 min'
            }
        };
        
        // Meal options for each meal type
        const mealOptions = {
            breakfast: [
                { name: 'Quinoa Bowl', path: getMealImagePath('Quinoa Bowl with Chickpeas and Vegetables'), nutrition: { calories: 320, protein: 12, carbs: 45, fat: 8 } },
                { name: 'Oatmeal with Fruits', path: getMealImagePath('Dairy-Free Oatmeal with Berries'), nutrition: { calories: 350, protein: 10, carbs: 60, fat: 7 } },
                { name: 'Greek Yogurt with Honey', path: getMealImagePath('Dairy-Free Yogurt with Fruit'), nutrition: { calories: 280, protein: 18, carbs: 30, fat: 9 } },
                { name: 'Scrambled Eggs with Vegetables', path: getMealImagePath('Black Bean Burgers on Gluten-Free Buns'), nutrition: { calories: 310, protein: 20, carbs: 15, fat: 22 } },
                { name: 'Gluten-Free Pancakes', path: getMealImagePath('Gluten-Free Pancakes with Fruit'), nutrition: { calories: 380, protein: 8, carbs: 65, fat: 10 } }
            ],
            lunch: [
                { name: 'Grilled Chicken Salad', path: getMealImagePath('Chicken Salad Sandwich (Gluten-Free Bread)'), nutrition: { calories: 450, protein: 35, carbs: 30, fat: 15 } },
                { name: 'Quinoa Salad with Tofu', path: getMealImagePath('Quinoa Salad with Tofu and Vegetables'), nutrition: { calories: 410, protein: 18, carbs: 50, fat: 14 } },
                { name: 'Turkey and Vegetable Wrap', path: getMealImagePath('Turkey and Vegetable Wrap'), nutrition: { calories: 440, protein: 28, carbs: 45, fat: 12 } },
                { name: 'Lentil Soup with Brown Rice', path: getMealImagePath('Lentil Soup with Brown Rice'), nutrition: { calories: 380, protein: 15, carbs: 55, fat: 8 } },
                { name: 'Chicken Stir-Fry', path: getMealImagePath('Chicken Stir-Fry with Brown Rice'), nutrition: { calories: 470, protein: 32, carbs: 48, fat: 16 } }
            ],
            dinner: [
                { name: 'Salmon with Vegetables', path: getMealImagePath('Baked Salmon with Roasted Vegetables'), nutrition: { calories: 520, protein: 40, carbs: 25, fat: 28 } },
                { name: 'Vegetable Stir-fry with Quinoa', path: getMealImagePath('Vegetable Stir-fry with Quinoa'), nutrition: { calories: 420, protein: 15, carbs: 60, fat: 12 } },
                { name: 'Turkey Meatloaf', path: getMealImagePath('Turkey Meatloaf with Sweet Potato'), nutrition: { calories: 480, protein: 35, carbs: 35, fat: 20 } },
                { name: 'Baked Salmon with Sweet Potato', path: getMealImagePath('Baked Salmon with Sweet Potato'), nutrition: { calories: 510, protein: 38, carbs: 28, fat: 24 } },
                { name: 'Chicken and Vegetable Stir-fry', path: getMealImagePath('Chicken and Vegetable Stir-fry'), nutrition: { calories: 450, protein: 30, carbs: 40, fat: 18 } }
            ],
            snack: [
                { name: 'Greek Yogurt with Berries', path: getMealImagePath('Greek Yogurt with Fruit and Granola'), nutrition: { calories: 180, protein: 15, carbs: 20, fat: 5 } },
                { name: 'Smoothie with Spinach', path: getMealImagePath('Smoothie with Spinach, Banana, and Dairy-Free Protein Powder'), nutrition: { calories: 210, protein: 18, carbs: 30, fat: 3 } },
                { name: 'Dairy-Free Yogurt with Nuts', path: getMealImagePath('Dairy-Free Yogurt with Fruit and Nuts'), nutrition: { calories: 190, protein: 8, carbs: 15, fat: 12 } },
                { name: 'Mixed Berries with Honey', path: getMealImagePath('Quinoa Bowl with Chickpeas and Vegetables'), nutrition: { calories: 120, protein: 2, carbs: 25, fat: 1 } }
            ]
        };
        
        // Get meals for the selected day
        const getMealsForDay = (day) => {
            // Use index of day to create some variation in meals
            const dayIndex = allDays.indexOf(day.toLowerCase());
            
            const meals = [];
            
            // Add breakfast
            const breakfastIndex = dayIndex % mealOptions.breakfast.length;
            const breakfastOption = mealOptions.breakfast[breakfastIndex];
            meals.push({
                id: `placeholder-breakfast-${day}`,
                type: baseMeals.breakfast.type,
                mealName: breakfastOption.name,
                mealPath: breakfastOption.path,
                mealTime: baseMeals.breakfast.mealTime,
                mealNutrition: `${breakfastOption.nutrition.calories} Cal | ${breakfastOption.nutrition.protein}g Protein`,
                cookTime: baseMeals.breakfast.cookTime,
                nutrition: breakfastOption.nutrition,
                dayName: day.toLowerCase()
            });
            
            // Add lunch
            const lunchIndex = (dayIndex + 2) % mealOptions.lunch.length;
            const lunchOption = mealOptions.lunch[lunchIndex];
            meals.push({
                id: `placeholder-lunch-${day}`,
                type: baseMeals.lunch.type,
                mealName: lunchOption.name,
                mealPath: lunchOption.path,
                mealTime: baseMeals.lunch.mealTime,
                mealNutrition: `${lunchOption.nutrition.calories} Cal | ${lunchOption.nutrition.protein}g Protein`,
                cookTime: baseMeals.lunch.cookTime,
                nutrition: lunchOption.nutrition,
                dayName: day.toLowerCase()
            });
            
            // Add dinner
            const dinnerIndex = (dayIndex + 4) % mealOptions.dinner.length;
            const dinnerOption = mealOptions.dinner[dinnerIndex];
            meals.push({
                id: `placeholder-dinner-${day}`,
                type: baseMeals.dinner.type,
                mealName: dinnerOption.name,
                mealPath: dinnerOption.path,
                mealTime: baseMeals.dinner.mealTime,
                mealNutrition: `${dinnerOption.nutrition.calories} Cal | ${dinnerOption.nutrition.protein}g Protein`,
                cookTime: baseMeals.dinner.cookTime,
                nutrition: dinnerOption.nutrition,
                dayName: day.toLowerCase()
            });
            
            // Add snack
            const snackIndex = (dayIndex + 1) % mealOptions.snack.length;
            const snackOption = mealOptions.snack[snackIndex];
            meals.push({
                id: `placeholder-snack-${day}`,
                type: baseMeals.snack.type,
                mealName: snackOption.name,
                mealPath: snackOption.path,
                mealTime: baseMeals.snack.mealTime,
                mealNutrition: `${snackOption.nutrition.calories} Cal | ${snackOption.nutrition.protein}g Protein`,
                cookTime: baseMeals.snack.cookTime,
                nutrition: snackOption.nutrition,
                dayName: day.toLowerCase()
            });
            
            return meals;
        };
        
        // Get meals for the selected day
        const dayMeals = getMealsForDay(day);
        
        setFilteredMeals(dayMeals);
        calculateTotalNutrition(dayMeals);
    };

    // Function to get the formatted date for a day tab
    const getDayTabDate = (day) => {
        const dayDate = getDateForDay(day);
        return dayDate.getDate();
    };
    
    return (
        <div className='overflow-y-auto h-full p-6 grow flex flex-col gap-6'>
            <div className='flex flex-col gap-6'>
                <div className='flex justify-between items-center'>
                    <div>
                        <h1 className='text-2xl font-semibold'>Weekly Meal Schedule</h1>
                        {mealPlans.length > 0 && mealPlans[selectedPlanIndex] && (
                            <p className='text-gray-600'>
                                Viewing meals for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}, {formatPlanDate(mealPlans[selectedPlanIndex].planDate)}
                            </p>
                        )}
                    </div>
                    
                    {mealPlans.length > 0 && (
                        <div className='flex items-center gap-3'>
                            <span className='text-gray-600'>Meal Plan:</span>
                            <Select 
                                value={selectedPlanIndex.toString()} 
                                onValueChange={(value) => handlePlanChange(parseInt(value, 10))}
                            >
                                <SelectTrigger className="w-[240px]">
                                    <SelectValue placeholder="Select a meal plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mealPlans.map((plan, index) => (
                                        <SelectItem key={plan.planID} value={index.toString()}>
                                            {formatPlanDate(plan.planDate)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                
                <div className='days'>
                    <ToggleGroup 
                        type='single' 
                        value={selectedDay} 
                        onValueChange={(value) => value && handleDayChange(value)}
                    >
                        <ToggleGroupItem value='monday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>
                            Mon<br/><span className="text-xs">{getDayTabDate('monday')}</span>
                        </ToggleGroupItem>
                        <ToggleGroupItem value='tuesday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>
                            Tue<br/><span className="text-xs">{getDayTabDate('tuesday')}</span>
                        </ToggleGroupItem>
                        <ToggleGroupItem value='wednesday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>
                            Wed<br/><span className="text-xs">{getDayTabDate('wednesday')}</span>
                        </ToggleGroupItem>
                        <ToggleGroupItem value='thursday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>
                            Thu<br/><span className="text-xs">{getDayTabDate('thursday')}</span>
                        </ToggleGroupItem>
                        <ToggleGroupItem value='friday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>
                            Fri<br/><span className="text-xs">{getDayTabDate('friday')}</span>
                        </ToggleGroupItem>
                        <ToggleGroupItem value='saturday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>
                            Sat<br/><span className="text-xs">{getDayTabDate('saturday')}</span>
                        </ToggleGroupItem>
                        <ToggleGroupItem value='sunday' size={'lg'} className={'w-24 h-14 text-lg bg-gray-200 hover:bg-indigo-900 hover:text-white data-[state=on]:bg-indigo-900 data-[state=on]:text-white'}>
                            Sun<br/><span className="text-xs">{getDayTabDate('sunday')}</span>
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>

            {isLoading ? (
                <div className='flex justify-center items-center w-full py-20'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-800'></div>
                </div>
            ) : error ? (
                <div className='flex justify-center items-center w-full py-20'>
                    <p className='text-red-600 text-center'>{error}</p>
                </div>
            ) : (
                <div className='flex items-start justify-between gap-8 pl-10'>
                    <div className='grow grid xl:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-6'>
                        {filteredMeals.length > 0 ? (
                            filteredMeals.map((meal, index) => (
                                <PlanningMealCard 
                                    key={meal.id || index}
                                    time={meal.mealTime} 
                                    type={meal.type} 
                                    calCount={`${meal.nutrition?.calories || 0} KCal`} 
                                    mealName={meal.mealName} 
                                    imgPath={meal.mealPath}
                                    mealId={meal.id}
                                />
                            ))
                        ) : (
                            <div className='col-span-2 flex flex-col justify-center items-center py-20 w-full gap-4'>
                                {mealPlans.length > 0 ? (
                                    <>
                                        <p className='text-gray-600 text-lg text-center'>
                                            No meals available for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} in the 
                                            {mealPlans[selectedPlanIndex] ? 
                                                ` meal plan from ${formatPlanDate(mealPlans[selectedPlanIndex].planDate)}` : 
                                                ' selected meal plan'}.
                                        </p>
                                        <div className='flex gap-2'>
                                            <button 
                                                className='px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200'
                                                onClick={() => loadPlaceholderMeals(selectedDay)}
                                            >
                                                Show sample meals
                                            </button>
                                            
                                            {/* Find the nearest day with meals */}
                                            <button 
                                                className='px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800'
                                                onClick={() => {
                                                    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                                                    // Look through other days to find one with meals
                                                    for (let i = 1; i <= 6; i++) {
                                                        const currentDayIndex = days.indexOf(selectedDay);
                                                        const nextDayIndex = (currentDayIndex + i) % 7;
                                                        const nextDay = days[nextDayIndex];
                                                        handleDayChange(nextDay);
                                                        break;
                                                    }
                                                }}
                                            >
                                                View another day
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className='text-gray-600 text-lg'>No meal plans available. Create a meal plan to get started.</p>
                                        <button 
                                            className='px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200'
                                            onClick={() => loadPlaceholderMeals(selectedDay)}
                                        >
                                            Show sample meals
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col items-center justify-center gap-4'>
                        <TodayMacro 
                            calories={nutrition.calories} 
                            protein={nutrition.protein} 
                            carbs={nutrition.carbs} 
                            fats={nutrition.fats} 
                        />

                        <div className='h-56 w-80 bg-slate-100 rounded-md px-4 py-3 flex flex-col items-start justify-start gap-1'>
                            <div>
                                <h1 className='text-xl font-medium'>Hydration</h1>
                            </div>
                            <div className='flex items-center justify-center w-full h-full'>
                                <div className="radial-progress text-indigo-800 scale-[1.5]" style={{ "--value": getGlassPercentage(glasses) }} aria-valuenow={getGlassPercentage(glasses)} role="progressbar">
                                    {getGlassPercentage(glasses)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ScheduleScreen