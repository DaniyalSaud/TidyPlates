import React, { useContext, useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import ReminderItem from "../components/ReminderItem";
import MealCard from "../components/MealCard";
import { GlassContext } from "@/contexts/hydrationContext";
import { LoggedInContext, UserIDContext } from "@/contexts/loginContext";
import { useNavigate } from "react-router";
import TodayMacro from "../components/TodayMacro";
import { getMealImagePath } from "@/lib/utils";
import AddReminderDialog from "../components/AddReminderDialog";

function MainScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(new Date());
  const { loggedIn } = useContext(LoggedInContext);
  const { userID } = useContext(UserIDContext);
  const [username, setUsername] = useState("User");
  const [todayMeals, setTodayMeals] = useState([]);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkStatus, setNetworkStatus] = useState('online');
  const [reminders, setReminders] = useState([]);
  const [noTodayPlan, setNoTodayPlan] = useState(false);
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
      navigate('/dashboard/main');
    }
    
    // Setup network status detection
    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check current status
    setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    
    // Set up a timer to check for meal changes every minute
    const intervalId = setInterval(() => {
      if (todayMeals.length > 0) {
        const newCurrentMeal = findCurrentMeal(todayMeals);
        if (newCurrentMeal && (!currentMeal || newCurrentMeal.type !== currentMeal.type)) {
          setCurrentMeal(newCurrentMeal);
        }
      }
    }, 60000); // Check every minute
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [todayMeals, currentMeal]);

  // Get username from localStorage when component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    // Fetch meal plans when component mounts or userID changes
    if (userID && networkStatus === 'online') {
      fetchTodaysMeals();
      fetchReminders(); // Fetch reminders when component mounts
    } else if (networkStatus === 'offline') {
      setError("You're currently offline. Please check your internet connection.");
      loadPlaceholderMeals();
      setIsLoading(false);
    }
  }, [userID, networkStatus]);
  
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
        // Fetch the new meals after successful generation
        setNoTodayPlan(false);
        await fetchTodaysMeals();
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

  const loadPlaceholderMeals = () => {
    const placeholderMeals = [
      {
        type: "Breakfast",
        mealName: "Oatmeal with Berries",
        mealPath: getMealImagePath("Oatmeal with Banana and Berries"),
        mealNutrition: "320 Cal | 12g Protein",
        cookTime: "15 min",
        nutrition: { calories: 320, protein: 12, carbs: 45, fat: 8 }
      },
      {
        type: "Lunch",
        mealName: "Grilled Chicken Salad",
        mealPath: getMealImagePath("Grilled Chicken Salad with Quinoa"),
        mealNutrition: "450 Cal | 35g Protein",
        cookTime: "25 min",
        nutrition: { calories: 450, protein: 35, carbs: 30, fat: 15 }
      },
      {
        type: "Dinner",
        mealName: "Baked Salmon",
        mealPath: getMealImagePath("Baked Salmon with Roasted Vegetables"),
        mealNutrition: "520 Cal | 40g Protein", 
        cookTime: "30 min",
        nutrition: { calories: 520, protein: 40, carbs: 35, fat: 20 }
      },
      {
        type: "Snack",
        mealName: "Greek Yogurt with Fruit",
        mealPath: getMealImagePath("Greek Yogurt with Fruit and Granola"),
        mealNutrition: "180 Cal | 15g Protein",
        cookTime: "5 min",
        nutrition: { calories: 180, protein: 15, carbs: 20, fat: 5 }
      }
    ];
    
    setTodayMeals(placeholderMeals);
    
    // Find the current meal based on time of day from placeholder meals
    const currentMealItem = findCurrentMeal(placeholderMeals);
    setCurrentMeal(currentMealItem || null);
    
    // Calculate total nutrition from placeholder meals
    calculateTotalNutrition(placeholderMeals);
  };
  
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
  
  // State to store a simulated hour (for testing/debugging purposes)
  const [simulatedHour, setSimulatedHour] = useState(null);
  
  // Function to determine the current meal type based on the current time
  const getCurrentMealType = () => {
    // Use simulated hour if available, otherwise use current hour
    const now = new Date();
    const hour = simulatedHour !== null ? simulatedHour : now.getHours();
    
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
  
  // Function to simulate different times of day (for testing/debugging only)
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
    
    // Then immediately find and set the current meal based on the new hour
    // This ensures the meal gets updated with the correct time
    if (todayMeals.length > 0) {
      // Create a helper function that uses the new hour directly
      const getCurrentMealTypeForHour = (hour) => {
        const actualHour = hour !== null ? hour : new Date().getHours();
        
        if (actualHour >= 5 && actualHour < 11) {
          return "Breakfast";
        } else if (actualHour >= 11 && actualHour < 16) {
          return "Lunch";
        } else if (actualHour >= 16 && actualHour < 21) {
          return "Dinner";
        } else {
          return "Snack";
        }
      };
      
      const currentType = getCurrentMealTypeForHour(newHour);
      const newCurrentMeal = todayMeals.find(meal => meal.type === currentType);
      setCurrentMeal(newCurrentMeal || todayMeals[0]);
    }
  };
  
  // Function to find the current meal from the list of meals
  const findCurrentMeal = (meals) => {
    const currentType = getCurrentMealType();
    return meals.find(meal => meal.type === currentType);
  };
  
  const fetchTodaysMeals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Make API call to get user's meal plans using the proper base URL
      const response = await fetch(`/api/account/mealplan/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID }),
        // Adding timeout to prevent long-hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch meal plans: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Response from meal plan API:", data);
      
      if (data.status === 200 && data.mealPlans && data.mealPlans.length > 0) {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        console.log("Today's date:", today);
        
        // Find today's meal plan
        const todayMealPlan = data.mealPlans.find(plan => plan.planDate === today);
        
        // If no meal plan for today, show appropriate message
        if (!todayMealPlan) {
          setError("No meal plan found for today. Please generate new meal plans.");
          setNoTodayPlan(true); // Set this state to true to show generate button
          setTodayMeals([]);
          setIsLoading(false);
          return;
        }
        
        // Use today's meal plan ID
        const latestPlanID = todayMealPlan.planID;
        
        // Now fetch the meals for this plan using the correct endpoint and method
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
          // Format meals for display
          const formattedMeals = mealsData.meals.map(meal => {
            // Determine meal type based on timeToEat
            const timeToEat = meal.mealTime
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
            
            return {
              type,
              mealName,
              mealPath,
              mealNutrition: `${meal.nutrition ? meal.nutrition.calories : "?"} Cal | ${meal.nutrition ? meal.nutrition.protein : "?"} g Protein`,
              cookTime: meal.cookTime || "30 min",
              nutrition: meal.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 }
            };
          });
          
          setTodayMeals(formattedMeals);
          
          // Find the current meal based on time of day
          const currentMealItem = findCurrentMeal(formattedMeals);
          setCurrentMeal(currentMealItem || null);
          
          // Calculate total nutrition values from all meals
          calculateTotalNutrition(formattedMeals);
        } else {
          // Fallback to placeholder data if no meals found
          loadPlaceholderMeals();
        }
      } else {
        // Fallback to placeholder data
        loadPlaceholderMeals();
      }
    } catch (err) {
      console.error('Error fetching meal plans:', err);
      setError(err.message || 'Failed to fetch meal data. Please try again later.');
      // Fallback to placeholder data
      loadPlaceholderMeals();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add fetchReminders function
  const fetchReminders = async () => {
    try {
      // Clear existing reminders before fetching new ones
      setReminders([]);
      
      // Make API call to fetch reminders for the logged-in user
      const response = await fetch(`/api/account/reminders?userID=${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reminders: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 200 && data.reminders && data.reminders.length > 0) {
        // Format the reminders for display and track IDs to prevent duplicates
        const processedIDs = new Set();
        const formattedReminders = [];
        
        data.reminders.forEach(reminder => {
          // Skip if we've already processed this ID
          if (processedIDs.has(reminder.reminderID)) return;
          
          processedIDs.add(reminder.reminderID);
          
          // Format time from the database (HH:MM) to 12-hour format with AM/PM
          const formatTime = (timeToRemind) => {
            if (!timeToRemind) return '';
            
            const [hours, minutes] = timeToRemind.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 || 12;
            return `${formattedHour}:${minutes} ${ampm}`;
          };

          formattedReminders.push({
            reminderID: reminder.reminderID,
            reminderText: reminder.reminderText,
            reminderTime: formatTime(reminder.timeToRemind)
          });
        });

        setReminders(formattedReminders);
      }
    } catch (err) {
      console.error('Error fetching reminders:', err);
      // We'll keep the default reminders if there's an error
    }
  };
  
  const handleGlassIncrement = () => {
    const maxGlasses = 10; // Assuming 10 glasses is the maximum for a day
    setGlasses((prev) => (prev < maxGlasses ? prev + 1 : prev));
  };

  const handleGlassDecrement = () => {
    setGlasses((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const getGlassPercentage = (glasses) => {
    const maxGlasses = 10; // Assuming 10 glasses is the maximum for a day
    return (glasses / maxGlasses) * 100;
  };

  const handleAddReminder = async (reminder) => {
    try {
      // Make the API call to add the reminder with the correct endpoint
      const response = await fetch('/api/account/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userID,
          reminderText: reminder.reminderText,
          timeToRemind: reminder.reminderTime // Send the original 24-hour format time
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to add reminder: ${response.status}`);
      }

      const data = await response.json();
      
      // If successful, refresh all reminders from the server
      if (data.status === 200) {
        console.log('Reminder added successfully, refreshing reminders list');
        // Refresh the whole reminders list from server to ensure consistency
        await fetchReminders();
      }
    } catch (err) {
      console.error('Error adding reminder:', err);
      // Add UI notification here if you want to show an error to the user
    }
  };

  const handleDeleteReminder = async (reminderID) => {
    try {
      // Call the API to delete the reminder
      const response = await fetch('/api/account/reminders', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reminderID,
          userID  // Include userID in the delete request
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to delete reminder: ${response.status}`);
      }

      const data = await response.json();
      
      // If successful, refresh all reminders from the server
      if (data.status === 200) {
        console.log('Reminder deleted successfully, refreshing reminders list');
        // Refresh the whole reminders list from server to ensure consistency
        await fetchReminders();
      }
    } catch (err) {
      console.error('Error deleting reminder:', err);
      // Add UI notification here if you want to show an error to the user
    }
  };

  const { glasses, setGlasses } = useContext(GlassContext);

  return (
    <div className="overflow-y-auto h-full p-6 grow">
      <div className="greetings flex flex-col justify-center gap-1 pb-4">
        <h1 className="text-2xl font-semibold">Welcome, {username.toUpperCase()}</h1>
        <p className="text-black/60">Check out your personalized meals</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="calendar flex flex-col items-center justify-start px-4 pt-4 h-[24rem] w-[24rem] bg-slate-200 rounded-md">
          <h1 className="text-xl font-medium">Today's meal plan</h1>
          <Calendar
            selected={selected}
            mode="single"
            fromMonth={selected}
            toMonth={selected}
          />
        </div>

        <div className="reminders grow bg-slate-200 rounded-md h-[24rem] p-4">
          <div className="flex justify-between items-center pb-2">
            <h1 className="text-xl font-medium">Reminders</h1>
            <AddReminderDialog onAddReminder={handleAddReminder} />
          </div>
          <div className="reminders-list flex flex-col gap-2 p-4 overflow-y-auto h-[18rem]">
            {reminders.map((reminder, index) => (
              <ReminderItem
                key={reminder.reminderID || index}
                reminderID={reminder.reminderID}
                reminderText={reminder.reminderText}
                reminderTime={reminder.reminderTime}
                onDelete={handleDeleteReminder}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Display the current meal prominently or a message if no meal is available for current time */}
      {!isLoading && !error && (
        currentMeal ? (
        <div className="current-meal mt-6 bg-indigo-50 rounded-md w-full p-4 border-2 border-indigo-200">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-medium">Current Meal: {currentMeal.type}</h1>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  const newCurrentMeal = findCurrentMeal(todayMeals);
                  setCurrentMeal(newCurrentMeal || null);
                }}
                className="bg-indigo-500 text-white px-2 py-1 rounded-md text-sm hover:bg-indigo-600 transition-all"
              >
                Refresh
              </button>
              <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-60 h-40">
              <img
                src={currentMeal.mealPath}
                alt={currentMeal.mealName}
                className="w-full h-full object-cover rounded-md shadow-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">{currentMeal.mealName}</h2>
              <p className="text-gray-600">{currentMeal.mealNutrition}</p>
              <p className="text-gray-600">Cook Time: {currentMeal.cookTime}</p>
              <button 
                className="bg-indigo-500 text-white px-3 py-2 rounded-md mt-2 hover:bg-indigo-600 transition-all w-fit"
                onClick={() => navigate('/dashboard/planning')}
              >
                View Recipe Details
              </button>
            </div>
          </div>
        </div>
        ) : todayMeals.length > 0 ? (
          <div className="current-meal mt-6 bg-yellow-50 rounded-md w-full p-4 border-2 border-yellow-200">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-medium">No meal scheduled for current time</h1>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    const newCurrentMeal = findCurrentMeal(todayMeals);
                    setCurrentMeal(newCurrentMeal || null);
                  }}
                  className="bg-indigo-500 text-white px-2 py-1 rounded-md text-sm hover:bg-indigo-600 transition-all"
                >
                  Refresh
                </button>
                <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            <p className="mt-2">The meal plan doesn't have a meal scheduled for the current time ({getCurrentMealType()}). Choose from your available meals below.</p>
          </div>
        ) : null
      )}

      <div className="meal-plan mt-6 bg-slate-100 h-80 rounded-md w-full flex flex-col gap-3 p-4">
        <h1 className="text-xl font-medium">Today's Meal Plan</h1>
        <div className="h-full flex items-center justify-around gap-x-2 overflow-x-auto custom-scrollbar pb-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-800"></div>
              <p className="mt-2 text-sm text-gray-600">Loading meal plan...</p>
            </div>
          ) : noTodayPlan ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-lg text-red-600">No meal plan found for today.</p>
              <button 
                onClick={generateNewMealPlans}
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-2 transition-all"
              >
                Generate New Meal Plans
              </button>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600">{error}</p>
              {networkStatus === 'offline' && 
                <p className="text-sm text-gray-500 mt-1">
                  Showing sample meal plan while offline.
                </p>
              }
            </div>
          ) : todayMeals.length > 0 ? (
            todayMeals.map((meal, index) => (
              <MealCard
                key={index}
                type={meal.type}
                mealName={meal.mealName}
                mealPath={meal.mealPath}
                mealNutrition={meal.mealNutrition}
                cookTime={meal.cookTime}
                isActive={currentMeal && meal.type === currentMeal.type}
              />
            ))
          ) : (
            <p>No meals found for today. Try generating a meal plan!</p>
          )}
        </div>
      </div>

      {/* Debug controls for simulating different times of day (only in development) */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-6 bg-gray-100 rounded-md p-4 border border-gray-300">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-medium">Simulate time of day:</h2>
            <div className="flex gap-2">
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
            <div className="ml-auto text-xs text-gray-500">
              {simulatedHour !== null ? `Simulating: ${simulatedHour}:00` : 'Using actual time'}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center gap-6 pt-4">
        <div className="bg-slate-100 w-96 rounded-md">
          <TodayMacro 
            protein={nutrition.protein} 
            carbs={nutrition.carbs} 
            fats={nutrition.fats}
            calories={nutrition.calories}
          />
        </div>

        <div className="h-64 bg-slate-100 w-96 rounded-md flex flex-col justify-center items-start gap-6 p-4">
          <div>
            <h1 className="text-lg font-medium">Hydration</h1>
            {networkStatus === 'offline' && <p className="text-xs text-red-600">Network status: Offline</p>}
          </div>
          <div className="flex items-center justify-center w-full h-full">
            <div
              className="radial-progress text-indigo-800 scale-[1.5]"
              style={{ "--value": getGlassPercentage(glasses) }}
              aria-valuenow={getGlassPercentage(glasses)}
              role="progressbar"
            >
              {getGlassPercentage(glasses)}%
            </div>
          </div>

          <div className="flex items-center justify-end w-full">
            <button
              className="h-10 w-10 text-2xl hidden items-center justify-center font-medium rounded-full bg-gray-400"
              onClick={handleGlassDecrement}
            >
              <h1>-</h1>
            </button>
            <button
              className="h-10 w-30 text-2xl flex items-center justify-center font-medium rounded-full bg-gray-400"
              onClick={handleGlassIncrement}
            >
              <h1 className='text-sm font-medium'>Drink a glass</h1>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainScreen;
