import React from 'react'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AutoFixNormalOutlinedIcon from '@mui/icons-material/AutoFixNormalOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import IngredientItem from '../components/IngredientItem';
import InstructionsItem from '../components/InstructionsItem';
function PlanningScreen() {
    return (
        <div className='overflow-y-auto h-full p-6 grow flex flex-col item-center gap-6'>
            <div className='bg-gray-200 flex flex-col gap-8 rounded-md p-6'>
                <div className='flex items-center justify-between gap-4'>
                    <h1 className='text-4xl font-bold'>Quinoa Bowl with Roasted Vegetables</h1>
                    <h1 className='text-4xl font-bold pr-4'>Lunch</h1>
                </div>

                <div className='flex items-center justify-start gap-10'>
                    <div className='h-60 w-96 bg-red-500'>
                        <img src="s" alt="meal pic here" className='w-full h-full rounded-md' />
                    </div>
                    <div className='flex flex-col gap-7 h-60 justify-start'>
                        <p>
                            A nutritious and colorful Buddha bowl featuring protein-rich quinoa, perfectly roasted
                            seasonal vegetables, and a creamy tahini dressing. This balanced meal is perfect for lunch or dinner.
                        </p>

                        <div className='nutrition-flags flex items-center gap-10'>
                            <div className='flex flex-col items-center justify-center w-24 h-14 bg-white rounded-md nav-icon-shadow hover:scale-110 transition-all ease-in-out'>
                                <h1 className='font-bold text-indigo-500'>450</h1>
                                <h1 className='text-black/30 font-bold text-sm'>Calories</h1>
                            </div>
                            <div className='flex flex-col items-center justify-center w-24 h-14 bg-white rounded-md nav-icon-shadow hover:scale-110 transition-all ease-in-out'>
                                <h1 className='font-bold text-indigo-500'>450</h1>
                                <h1 className='text-black/30 font-bold text-sm'>Protein</h1>
                            </div>
                            <div className='flex flex-col items-center justify-center w-24 h-14 bg-white rounded-md nav-icon-shadow hover:scale-110 transition-all ease-in-out'>
                                <h1 className='font-bold text-indigo-500'>450</h1>
                                <h1 className='text-black/30 font-bold text-sm'>Carbs</h1>
                            </div>
                            <div className='flex flex-col items-center justify-center w-24 h-14 bg-white rounded-md nav-icon-shadow hover:scale-110 transition-all ease-in-out'>
                                <h1 className='font-bold text-indigo-500'>450</h1>
                                <h1 className='text-black/30 font-bold text-sm'>Fats</h1>
                            </div>
                        </div>

                        <div className='flex items-center justify-start gap-6'>
                            <button className='bg-white hover:bg-gray-200 active:bg-gray-300 rounded-lg w-36 h-10 flex justify-center items-center gap-2 cursor-pointer transition-all ease-in-out'>
                                <FavoriteBorderOutlinedIcon color='black' fontSize='small' />
                                <h1 className='text-sm font-semibold'>Save Recipe</h1>
                            </button>
                            <button className='bg-white hover:bg-gray-200 active:bg-gray-300 rounded-lg w-36 h-10 flex justify-center items-center gap-2 cursor-pointer transition-all ease-in-out'>
                                <FileDownloadOutlinedIcon color='black' fontSize='small' />
                                <h1 className='text-sm font-semibold'>Download</h1>
                            </button>
                        </div>


                    </div>
                </div>

                <div>
                    <div className='flex items-center justify-start gap-4'>
                        <div className='flex flex-col items-center justify-center h-8 px-6 bg-white rounded-full nav-icon-shadow hover:scale-105 transition-all ease-in-out'>
                            <h1 className='text-black/70 font-semibold text-sm'>Vegan</h1>
                        </div>
                        <div className='flex flex-col items-center justify-center h-8 px-6 bg-white rounded-full nav-icon-shadow hover:scale-105 transition-all ease-in-out'>
                            <h1 className='text-black/70 font-semibold text-sm'>High Protein</h1>
                        </div>
                        <div className='flex flex-col items-center justify-center h-8 px-6 bg-white rounded-full nav-icon-shadow hover:scale-105 transition-all ease-in-out'>
                            <h1 className='text-black/70 font-semibold text-sm'>Veg</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex items-center justify-between gap-8'>
                <div className='w-[30rem] h-[22rem] rounded-md bg-gray-200 py-4 px-7 flex flex-col gap-4 justify-center'>
                    <h1 className='text-2xl font-semibold'>Ingredients</h1>
                    <div className='w-full h-[14rem] flex flex-col gap-2 overflow-y-auto px-1 custom-scrollbar'>
                        <IngredientItem item={'Quinoa'} quantity={'1 cup'} />
                        <IngredientItem item={'Quinoa'} quantity={'1 cup'} />
                        <IngredientItem item={'Quinoa'} quantity={'1 cup'} />
                        <IngredientItem item={'Quinoa'} quantity={'1 cup'} />
                        <IngredientItem item={'Quinoa'} quantity={'1 cup'} />
                        <IngredientItem item={'Quinoa'} quantity={'1 cup'} />
                        <IngredientItem item={'Quinoa'} quantity={'1 cup'} />
                        <IngredientItem item={'Quinoa'} quantity={'1 cup'} />
                    </div>

                    <button className='bg-gray-400 hover:bg-gray-400/70 active:bg-gray-400/90 flex items-center justify-center gap-2 rounded-lg w-64 h-10 cursor-pointer transition-all ease-in-out mx-auto'>
                        <ShoppingCartOutlinedIcon className='text-black/70' fontSize='small' />
                        <h1>Generate Grocery List</h1>
                    </button>
                </div>

                <div className='w-full h-[22rem] rounded-md bg-gray-200 py-4 px-7 flex flex-col gap-4 justify-center'>
                    <h1 className='text-2xl font-semibold'>Cooking Instructions</h1>
                    <div className='h-full flex flex-col item-center gap-3 overflow-y-auto custom-scrollbar'>
                        <InstructionsItem listNumber={1} instruction={'Rinse quinoa thoroughly and cook according to package instructions with a pinch of salt.'}/>
                        <InstructionsItem listNumber={2} instruction={'Preheat oven to 400°F (200°C). Cut sweet potatoes into 1-inch cubes, toss with olive oil and roast for 25 minutes.'}/>
                        <InstructionsItem listNumber={3} instruction={'Drain and rinse chickpeas, season with spices, and roast for 20 minutes until crispy.'}/>
                    </div>
                </div>
            </div>

            <div className='bg-gray-200 rounded-md py-4 px-7 flex flex-col gap-4 justify-center'>
                <h1 className='text-2xl font-semibold'>Customizations</h1>
                <div className='flex items-center justify-center gap-60 flex-wrap'>
                    <button className='bg-white/90 hover:bg-white/70 active:bg-gray-400/60 flex items-center justify-center gap-2 rounded-lg w-64 h-10 cursor-pointer transition-all ease-in-out'>
                        <AutoFixNormalOutlinedIcon color='black' fontSize='small' />
                        <h1>Generate Simalar Recipe</h1>
                    </button>

                    <button className='bg-white/90 hover:bg-white/70 active:bg-gray-400/60 flex items-center justify-center gap-2 rounded-lg w-64 h-10 cursor-pointer transition-all ease-in-out'>
                        <BrushOutlinedIcon color='black' fontSize='small' />
                        <h1>Change portion size</h1>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PlanningScreen