import React, { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, RefreshCw, Utensils } from "lucide-react"

function PlanningMealCard({type, time, mealName, calCount, imgPath, mealId}) {
  const [similarRecipeLoading, setSimilarRecipeLoading] = useState(false);
  const [portionSizeUpdating, setPortionSizeUpdating] = useState(false);
  const [portionSize, setPortionSize] = useState(1);
  const [nutritionMultiplier, setNutritionMultiplier] = useState(1);
  
  // Extract original calorie value for scaling
  const originalCalories = parseInt(calCount.replace(/[^0-9]/g, '')) || 0;
  
  const formatTime = (time) => {
    // Convert time to 12-hour format
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  // Function to generate similar recipe - would connect to backend
  const handleGenerateSimilarRecipe = async () => {
    setSimilarRecipeLoading(true);
    
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // For now, just show success message
      alert('Similar recipe generated successfully!');
      
    } catch (error) {
      console.error('Error generating similar recipe:', error);
      alert('Failed to generate similar recipe. Please try again.');
    } finally {
      setSimilarRecipeLoading(false);
    }
  }

  // Function to update portion size
  const handleUpdatePortionSize = async () => {
    setPortionSizeUpdating(true);
    
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      // For now, just update the nutrition multiplier locally
      setNutritionMultiplier(portionSize);
      
    } catch (error) {
      console.error('Error updating portion size:', error);
      alert('Failed to update portion size. Please try again.');
    } finally {
      setPortionSizeUpdating(false);
    }
  }
  
  return (
    <div className='h-50 2xl:min-w-[20rem] rounded-lg flex flex-col gap-4 justify-start item-center bg-gray-200 py-4 px-7 shadow-lg shadow-black/20 transition-all ease-in-out hover:scale-[1.02]'>
        
        <div className='top flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>{type}</h1>
            <h1 className='font-semibold'>{formatTime(time)}</h1>
        </div>

        <div className='flex items-start justify-start gap-4 py-4'>
            <img className='h-24 w-24 bg-amber-700 rounded-sm object-cover shadow-sm shadow-black/70' src={imgPath} alt={type + ' meal image'} />
            <div className="flex flex-col gap-1">
                <h1 className='text-lg font-medium'>{mealName}</h1>
                <h1 className='text-black/50 font-semibold'>
                    {nutritionMultiplier === 1 ? calCount : `${Math.round(originalCalories * nutritionMultiplier)} KCal`}
                </h1>
                
                {/* Action buttons */}
                <div className="flex gap-2 mt-2">
                    {/* Similar Recipe Dialog */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="secondary" className="flex items-center gap-1">
                                <RefreshCw className="h-4 w-4" />
                                Similar
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Generate Similar Recipe</DialogTitle>
                                <DialogDescription>
                                    Get a similar alternative to {mealName} with comparable nutritional profile.
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="flex flex-col gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-medium mb-2">Dietary Preferences</h3>
                                        <Select defaultValue="none">
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
                                        <Select defaultValue={type.toLowerCase()}>
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
                                    <Input placeholder="E.g. chicken, broccoli (optional)" />
                                </div>
                                
                                <div>
                                    <h3 className="font-medium mb-2">Ingredients to Exclude</h3>
                                    <Input placeholder="E.g. onions, peppers (optional)" />
                                </div>
                            </div>
                            
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={handleGenerateSimilarRecipe} disabled={similarRecipeLoading}>
                                    {similarRecipeLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="h-4 w-4" />
                                            Generate Similar Recipe
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    
                    {/* Portion Size Dialog */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="secondary" className="flex items-center gap-1">
                                <Utensils className="h-4 w-4" />
                                Portion
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Change Portion Size</DialogTitle>
                                <DialogDescription>
                                    Adjust the portion size for {mealName}. This will scale the ingredients and nutrition accordingly.
                                </DialogDescription>
                            </DialogHeader>
                            
                            <div className="flex flex-col gap-4 py-4">
                                <div>
                                    <h3 className="font-medium mb-2">Portion Multiplier</h3>
                                    <div className="flex items-center gap-3">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => portionSize > 0.25 && setPortionSize(prev => prev - 0.25)}
                                        >
                                            -
                                        </Button>
                                        <div className="w-full text-center bg-slate-100 py-2 rounded-md font-medium">
                                            {portionSize}x
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => portionSize < 4 && setPortionSize(prev => prev + 0.25)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="border-t pt-4">
                                    <h3 className="font-medium mb-2">Nutritional Information</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Calories:</span>
                                            <span className="font-medium">{Math.round(originalCalories * portionSize)} kcal</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Protein:</span>
                                            <span className="font-medium">≈ {Math.round(20 * portionSize)}g</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Carbs:</span>
                                            <span className="font-medium">≈ {Math.round(30 * portionSize)}g</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Fats:</span>
                                            <span className="font-medium">≈ {Math.round(15 * portionSize)}g</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={handleUpdatePortionSize} disabled={portionSizeUpdating}>
                                    {portionSizeUpdating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Portion Size'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default PlanningMealCard