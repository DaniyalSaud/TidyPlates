import React from 'react'

function SignUpPreference({ setFormPage }) {
  const handleFormChange = () => {
    setFormPage(curr => curr + 1);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  const handleGoBack = () => {
    setFormPage(curr => curr - 1);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    //pt-4 pb-4 pl-10 pr-10
    <>
      <div className='preference-form w-3/4 mx-auto rounded-lg shadow-lg bg-gray-50'>
        <div className='pb-8'>
          <h1 className='sign-up-form-top-heading pb-1'>Meal Preferences</h1>
          <p className='text-sm text-black/70'> Customize your meal plan by selecting your preferences below</p>
        </div>

        <div className='flex flex-col gap-6'>

          <div className='cuisines input-white-bg bottom-shadow pb-12'>
            <h1 className='text-xl font-medium pb-4'>Cuisine Preferences</h1>
            <div className='grid grid-cols-3 gap-4 justify-items-left items-center'>
              <div className='flex gap-2'>
                <input type="radio" name='indian' id='indian' />
                <label htmlFor='indian'>Indian</label>
              </div>
              <div className='flex gap-2'>
                <input type="radio" name='italian' id='italian' />
                <label htmlFor='italian'>Italian</label>
              </div>
              <div className='flex gap-2'>
                <input type="radio" name='asian  ' id='asian' />
                <label htmlFor='asian'>Asian</label>
              </div>
              <div className='flex gap-2'>
                <input type="radio" name='mexican' id='mexican' />
                <label htmlFor='mexican'>Mexican</label>
              </div>
              <div className='flex gap-2'>
                <input type="radio" name='medi' id='medi' />
                <label htmlFor='medi'>Mediterranean</label>
              </div>
              <div className='flex gap-2'>
                <input type="radio" name='east' id='east' />
                <label htmlFor='east'>Middle Eastern</label>
              </div>

            </div>
          </div>

          <div className='dislikes input-white-bg bottom-shadow pb-12'>
            <h1 className='text-xl font-medium pb-4'>Food Dislikes/Avoidance</h1>
            <div className='grid grid-cols-3 gap-4 justify-items-left items-center'>
              <div className='flex gap-2'>
                <input type="radio" name='spicy' id='spicy' />
                <label htmlFor='spicy'>Spicy food</label>
              </div>
              <div className='flex gap-2'>
                <input type="radio" name='sweet' id='sweet' />
                <label htmlFor='sweet'>Sweet dishes</label>
              </div>
              <div className='flex gap-2'>
                <input type="radio" name='bitter' id='bitter' />
                <label htmlFor='bitter'>Bitter Flavor</label>
              </div>
              <div className='flex gap-2'>
                <input type="radio" name='oily' id='oily' />
                <label htmlFor='oily'>Oily/Fried food</label>
              </div>
              <div className='flex gap-2'>
                <input type="radio" name='raw' id='raw' />
                <label htmlFor='raw'>Raw food</label>
              </div>
              <div className='flex gap-2'>
                <input type="radio" name='proc' id='proc' />
                <label htmlFor='proc'>Processed food</label>
              </div>

            </div>
          </div>

          <div className='meal-type input-white-bg bottom-shadow pb-12'>sdsd</div>
          <div className='cook-time input-white-bg bottom-shadow pb-12'>sdsds</div>

          <div className='ingredients input-white-bg bottom-shadow pb-12'>
            <h1 className='text-xl font-medium pb-4'>Preferred Ingredients</h1>
            <div className='grid grid-cols-2 gap-4 justify-items-left items-center'>
              <div className='flex gap-2'>
                <input type="radio" name='h-protein' id='h-protein' />
                <label htmlFor='h-protein'>High </label>
              </div>
              <div className='flex gap-2'>
                <input type="radio" name='italian' id='italian' />
                <label htmlFor='italian'>Italian</label>
              </div>
              <div className='flex gap-2'>
                <input type="radio" name='asian  ' id='asian' />
                <label htmlFor='asian'>Asian</label>
              </div>
              <div className='flex gap-2'>
                <input type="radio" name='mexican' id='mexican' />
                <label htmlFor='mexican'>Mexican</label>
              </div>

            </div>
          </div>

          <div className='frequency input-white-bg bottom-shadow pb-12'>asdad</div>
        </div>

      </div>
    </>
  )
}

export default SignUpPreference