import React, { useEffect, useState } from "react";

function SignUpPreference({ setFormPage, register, handleSubmit, watch, onFinalSubmit, isSubmitting }) {
  const [networkState, setNetworkState] = useState(navigator.onLine ? 'online' : 'offline');

  useEffect(() => {
    const handleOnline = () => setNetworkState('online');
    const handleOffline = () => setNetworkState('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleGoBack = () => {
    setFormPage((curr) => curr - 1);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <>
      <div className="preference-form w-3/4 mx-auto rounded-lg shadow-lg bg-gray-50 pt-4 pb-4 pl-10 pr-10 mb-6">
        <div className="pb-8">
          <h1 className="sign-up-form-top-heading pb-1">Meal Preferences</h1>
          <p className="text-sm text-black/70">
            Customize your meal plan by selecting your preferences below
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onFinalSubmit)}>
          <div className="cuisines pl-4 pt-2 input-white-bg bottom-shadow pb-12">
            <h1 className="text-xl font-medium pb-4">Cuisine Preferences</h1>
            <div className="grid grid-cols-3 gap-4 justify-items-left items-center">
              <div className="flex gap-2">
                <input type="checkbox" {...register("cuisines")} value="indian" id="indian" />
                <label htmlFor="indian">Indian</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" {...register("cuisines")} value="italian" id="italian" />
                <label htmlFor="italian">Italian</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" {...register("cuisines")} value="asian" id="asian" />
                <label htmlFor="asian">Asian</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" {...register("cuisines")} value="mexican" id="mexican" />
                <label htmlFor="mexican">Mexican</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" {...register("cuisines")} value="medi" id="medi" />
                <label htmlFor="medi">Mediterranean</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" {...register("cuisines")} value="east" id="east" />
                <label htmlFor="east">Middle Eastern</label>
              </div>
            </div>
          </div>

          <div className="dislikes pl-4 pt-2 input-white-bg bottom-shadow pb-12">
            <h1 className="text-xl font-medium pb-4">
              Food Dislikes/Avoidance
            </h1>
            <div className="grid grid-cols-3 gap-4 justify-items-left items-center">
              <div className="flex gap-2">
                <input type="checkbox" {...register("dislikes")} value="spicy" id="spicy" />
                <label htmlFor="spicy">Spicy food</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" {...register("dislikes")} value="sweet" id="sweet" />
                <label htmlFor="sweet">Sweet dishes</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" {...register("dislikes")} value="bitter" id="bitter" />
                <label htmlFor="bitter">Bitter Flavor</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" {...register("dislikes")} value="oily" id="oily" />
                <label htmlFor="oily">Oily/Fried food</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" {...register("dislikes")} value="raw" id="raw" />
                <label htmlFor="raw">Raw food</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" {...register("dislikes")} value="proc" id="proc" />
                <label htmlFor="proc">Processed food</label>
              </div>
            </div>
          </div>

          <div className="meal-type pl-4 pt-2 input-white-bg bottom-shadow pb-12">
            <h1 className="text-xl font-medium pb-4">Meal Type Preferences</h1>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="radio"
                  {...register("type_pref", {
                    value: "vegetarian",
                  })} name="pref"
                  id="vegetarian-pref"
                />
                <label htmlFor="vegetarian-pref">Vegetarian</label>
              </div>
              <div className="flex gap-2">
                <input type="radio" {...register("type_pref", {
                  value: "non-vegetarian",
                })} name="pref" id="non-veg-pref" />
                <label htmlFor="non-veg-pref">Non-Vegetarian</label>
              </div>
              <div className="flex gap-2">
                <input type="radio" {...register("type_pref", {
                  value: "vegan",
                })} name="pref" id="vegan-pref" />
                <label htmlFor="vegan-pref">Vegan</label>
              </div>
            </div>
          </div>

          <div className="cook-time pl-4 pt-2 input-white-bg bottom-shadow pb-12">
            <h1 className="text-xl font-medium pb-4">Cook Time Preferences</h1>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input type="radio" {...register("cooktimePref", {
                  value: "quick",
                })} name="time" id="quick-time" />
                <label htmlFor="quick-time">
                  Quick meals (Under 15 minutes)
                </label>
              </div>
              <div className="flex gap-2">
                <input type="radio" {...register("cooktimePref", {
                  value: "moderate",
                })} name="time" id="moderate-time" />
                <label htmlFor="moderate-time">Moderate (15-30 minutes)</label>
              </div>
              <div className="flex gap-2">
                <input type="radio" {...register("cooktimePref", {
                  value: "none",
                })} name="time" id="no-restriction" />
                <label htmlFor="no-restriction">No restriction</label>
              </div>
            </div>
          </div>

          <div className="ingredients pl-4 pt-2 input-white-bg bottom-shadow pb-12">
            <h1 className="text-xl font-medium pb-4">Preferred Ingredients</h1>
            <div className="grid grid-cols-2 gap-4 justify-items-left items-center">
              <div className="flex gap-2">
                <input type="checkbox" {...register("prefIngredients")} value="h-protein" id="h-protein" />
                <label htmlFor="h-protein">High-Protein Options </label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" {...register("prefIngredients")} value="low-card" id="low-card" />
                <label htmlFor="low-card">Low-carb choices</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" {...register("prefIngredients")} value="fiber" id="fiber" />
                <label htmlFor="fiber">Fiber-rich foods</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" {...register("prefIngredients")} value="seasonal" id="seasonal" />
                <label htmlFor="seasonal">Seasonal Fruits/Vegetables</label>
              </div>
            </div>
          </div>

          <div className="frequency pl-4 pt-2 input-white-bg bottom-shadow pb-12">
            <h1 className="text-xl font-medium pb-4">
              Meal Frequency & Timing
            </h1>
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-lg font-medium">No. of meals per day</h1>
                <select name="meals-per-day" {...register("mealsPerDay")} id="meals-per-day" required>
                  <option value="">Select</option>
                  <option value="2">2 meals</option>
                  <option value="3">3 meals</option>
                  <option value="4">4 meals</option>
                </select>
              </div>

              <div className="flex flex-col gap-6">
                <h1 className="text-lg font-medium">Preferred meal timing</h1>

                <div className="flex justify-around">
                  <div className="flex gap-2">
                    <input type="checkbox" {...register("prefMealTime")} value="breakfast" id="breakfast" />
                    <label htmlFor="breakfast">Breakfast </label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" {...register("prefMealTime")} value="lunch" id="lunch" />
                    <label htmlFor="lunch">Lunch</label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" {...register("prefMealTime")} value="snacks" id="snacks" />
                    <label htmlFor="snacks">Snacks</label>
                  </div>
                  <div className="flex gap-2">
                    <input type="checkbox" {...register("prefMealTime")} value="dinner" id="dinner" />
                    <label htmlFor="dinner">Dinner</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handleGoBack}
              type="button"
              className="cursor-pointer transition ease-in-out rounded-lg h-10 bg-white bottom-shadow w-20 hover:bg-gray-200 active:bg-gray-300"
              disabled={isSubmitting}
            >
              Previous
            </button>
            <button
              type="submit"
              disabled={isSubmitting || networkState === 'offline'}
              className={`cursor-pointer transition ease-in-out rounded-lg h-10 ${networkState === 'offline' ? 'bg-gray-400' : 'bg-black hover:bg-black/80 active:bg-black/60'} text-white font-medium w-40 ${isSubmitting || networkState === 'offline' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
          
          {isSubmitting && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Please wait while we create your personalized meal plans...</p>
              <div className="mt-2 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
              </div>
            </div>
          )}
          
          {networkState === 'offline' && !isSubmitting && (
            <div className="mt-4 text-center">
              <p className="text-xs text-red-600 flex items-center justify-center gap-1">
                <span className="inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                You are currently offline. Please reconnect to the internet to submit your form.
              </p>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default SignUpPreference;
