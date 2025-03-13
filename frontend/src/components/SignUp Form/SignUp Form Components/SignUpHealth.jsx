import React from 'react'
import SignupProgress from './SignupProgress'

const SignUpHealth = ({ setFormPage }) => {
    return (
        <>
            <div class="health-data w-4/5 mx-auto rounded-lg shadow-lg bg-gray-50">
                <h1 class="text-2xl font-bold pb-8">Health Data</h1>
                <form action="">
                    <div class="flex justify-between items-start gap-4">
                        <div class="flex flex-col gap-2 justify-center items-center">
                            <label for="age">Age</label>
                            <input type="number" name="age" id="age" class="input-bg bottom-shadow w-16 pl-5 " required />
                        </div>

                        <div class="gender-select flex flex-col gap-2 justify-center items-center">
                            <h1>Gender</h1>
                            <div class="input-bg bottom-shadow flex items-center p-2 pr-4 w-24">
                                <input type="radio" name="gender" id="male" />
                                    <label class="pl-4" for="male">Male</label>
                            </div>
                            <div class="input-bg bottom-shadow flex items-center p-2 w-24">
                                <input type="radio" name="gender" id="female" />
                                    <label class="pl-4" for="female">Female</label>
                            </div>
                            <div></div>
                        </div>

                        <div class="flex flex-col gap-2 justify-center items-center">
                            <div class="w-44 flex justify-between items-center gap-4">
                                <label for="weight">Weight (Kg)</label>
                                <input type="number" name="weight" id="weight" class="input-bg bottom-shadow w-16 pl-5" required />
                            </div>

                            <div class="w-44 flex justify-between items-center gap-4">
                                <label for="height">Height (Inch)</label>
                                <input type="number" name="height" id="height" class="input-bg bottom-shadow w-16 pl-5" required />
                            </div>

                        </div>
                    </div>

                    <div class="chronic-conditions">
                        <h1 class="text-xl font-medium pb-4">Chronic conditions</h1>
                        <div class="flex flex-col gap-4">
                            <div class="row-1 flex justify-between items-center gap-4">
                                <div class="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                                    <input type="radio" name="diabetes" id="diabetes" />
                                        <label class="pl-4" for="diabetes">Diabetes</label>
                                </div>
                                <div class="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                                    <input type="radio" name="cholesterol" id="cholesterol" />
                                        <label class="pl-4" for="cholesterol">High Cholesterol</label>
                                </div>
                                <div class="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                                    <input type="radio" name="hyper-tension" id="hyper-tension" />
                                        <label class="pl-4" for="hyper-tension">Hyper tension</label>
                                </div>
                            </div>

                            <div class="row-2 flex justify-between items-center gap-4">
                                <div class="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                                    <input type="radio" name="heart-disease" id="heart-disease" />
                                        <label class="pl-4" for="heart-disease">Heart disease</label>
                                </div>
                                <div class="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                                    <input type="radio" name="kidney-disease" id="kidney-disease" />
                                        <label class="pl-4" for="kidney-disease">Kidney disease</label>
                                </div>
                                <div class="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                                    <input type="radio" name="liver-disease" id="liver-disease" />
                                        <label class="pl-4" for="liver-disease">Liver disease</label>
                                </div>
                            </div>


                        </div>
                    </div>

                    <div class="other-condition flex justify-between items-center pt-4 pb-4">
                        <input class="input-bg bottom-shadow p-2 w-3/5 mx-auto" type="text" placeholder="Other conditions....." />
                    </div>

                    <div class="allergy">
                        <h1 class="text-xl font-medium pb-4">Allergies and Dietary Restrictions</h1>
                        <div class="flex flex-wrap gap-x-28 gap-y-10 items-center justify-center">
                            <div class="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                                <input type="radio" name="gluten-free" id="gluten-free" />
                                    <label class="pl-4" for="gluten-free">Gluten-free</label>
                            </div>
                            <div class="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                                <input type="radio" name="dairy-free" id="dairy-free" />
                                    <label class="pl-4" for="dairy-free">Dairy-free</label>
                            </div>
                            <div class="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                                <input type="radio" name="nut-allergy" id="nut-allergy" />
                                    <label class="pl-4" for="nut-allergy">Nut Allergy</label>
                            </div>
                            <div class="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                                <input type="radio" name="veg" id="veg" />
                                    <label class="pl-4" for="veg">Vegetarian</label>
                            </div>
                            <div class="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                                <input type="radio" name="keto" id="keto" />
                                    <label class="pl-4" for="keto">Keto</label>
                            </div>
                            <div class="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                                <input type="radio" name="fish-allergy" id="fish-allergy" />
                                    <label class="pl-4" for="fish-allergy">Fish Allergy</label>
                            </div>
                            <div class="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                                <input type="radio" name="vegan" id="vegan" />
                                    <label class="pl-4" for="vegan">Vegan</label>
                            </div>


                        </div>

                        <div class="extra-allergy flex justify-between items-center pt-4 pb-4">
                            <input class="input-bg bottom-shadow p-2 w-3/5 mx-auto" type="text" placeholder="Other allergies or restrictions....." />
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SignUpHealth;