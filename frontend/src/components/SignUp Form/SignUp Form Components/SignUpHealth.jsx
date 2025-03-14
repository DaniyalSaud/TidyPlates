import React from "react";
import SignupProgress from "./SignupProgress";

const SignUpHealth = ({ setFormPage }) => {

    const handleFormChange = () =>{

    }

    const handleGoBack = () => {
        
    }

  return (
    <>
      <div className="health-data w-4/5 mx-auto rounded-lg shadow-lg bg-gray-50">
        <h1 className="text-2xl font-bold pb-8">Health Data</h1>
        <form action="">
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col gap-2 justify-center items-center">
              <label for="age">Age</label>
              <input
                type="number"
                name="age"
                id="age"
                className="input-bg bottom-shadow w-16 pl-5 "
                required
              />
            </div>

            <div className="gender-select flex flex-col gap-2 justify-center items-center">
              <h1>Gender</h1>
              <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-24">
                <input type="radio" name="gender" id="male" />
                <label className="pl-4" for="male">
                  Male
                </label>
              </div>
              <div className="input-bg bottom-shadow flex items-center p-2 w-24">
                <input type="radio" name="gender" id="female" />
                <label className="pl-4" for="female">
                  Female
                </label>
              </div>
              <div></div>
            </div>

            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="w-44 flex justify-between items-center gap-4">
                <label for="weight">Weight (Kg)</label>
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  className="input-bg bottom-shadow w-16 pl-5"
                  required
                />
              </div>

              <div className="w-44 flex justify-between items-center gap-4">
                <label for="height">Height (Inch)</label>
                <input
                  type="number"
                  name="height"
                  id="height"
                  className="input-bg bottom-shadow w-16 pl-5"
                  required
                />
              </div>
            </div>
          </div>

          <div className="chronic-conditions">
            <h1 className="text-xl font-medium pb-4">Chronic conditions</h1>
            <div className="flex flex-col gap-4">
              <div className="row-1 flex justify-between items-center gap-4">
                <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                  <input type="radio" name="diabetes" id="diabetes" />
                  <label className="pl-4" for="diabetes">
                    Diabetes
                  </label>
                </div>
                <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                  <input type="radio" name="cholesterol" id="cholesterol" />
                  <label className="pl-4" for="cholesterol">
                    High Cholesterol
                  </label>
                </div>
                <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                  <input type="radio" name="hyper-tension" id="hyper-tension" />
                  <label className="pl-4" for="hyper-tension">
                    Hyper tension
                  </label>
                </div>
              </div>

              <div className="row-2 flex justify-between items-center gap-4">
                <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                  <input type="radio" name="heart-disease" id="heart-disease" />
                  <label className="pl-4" for="heart-disease">
                    Heart disease
                  </label>
                </div>
                <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                  <input
                    type="radio"
                    name="kidney-disease"
                    id="kidney-disease"
                  />
                  <label className="pl-4" for="kidney-disease">
                    Kidney disease
                  </label>
                </div>
                <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                  <input type="radio" name="liver-disease" id="liver-disease" />
                  <label className="pl-4" for="liver-disease">
                    Liver disease
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="other-condition flex justify-between items-center pt-4 pb-4">
            <input
              className="input-bg bottom-shadow p-2 w-3/5 mx-auto"
              type="text"
              placeholder="Other conditions....."
            />
          </div>

          <div className="allergy">
            <h1 className="text-xl font-medium pb-4">
              Allergies and Dietary Restrictions
            </h1>
            <div className="flex flex-wrap gap-x-28 gap-y-10 items-center justify-center">
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="radio" name="gluten-free" id="gluten-free" />
                <label className="pl-4" for="gluten-free">
                  Gluten-free
                </label>
              </div>
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="radio" name="dairy-free" id="dairy-free" />
                <label className="pl-4" for="dairy-free">
                  Dairy-free
                </label>
              </div>
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="radio" name="nut-allergy" id="nut-allergy" />
                <label className="pl-4" for="nut-allergy">
                  Nut Allergy
                </label>
              </div>
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="radio" name="veg" id="veg" />
                <label className="pl-4" for="veg">
                  Vegetarian
                </label>
              </div>
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="radio" name="keto" id="keto" />
                <label className="pl-4" for="keto">
                  Keto
                </label>
              </div>
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="radio" name="fish-allergy" id="fish-allergy" />
                <label className="pl-4" for="fish-allergy">
                  Fish Allergy
                </label>
              </div>
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="radio" name="vegan" id="vegan" />
                <label className="pl-4" for="vegan">
                  Vegan
                </label>
              </div>
            </div>

            <div className="extra-allergy flex justify-between items-center pt-4 pb-4">
              <input
                className="input-bg bottom-shadow p-2 w-3/5 mx-auto"
                type="text"
                placeholder="Other allergies or restrictions....."
              />
            </div>
          </div>

          <div className="medical-guidelines">
            <h1 className="text-xl font-medium pb-4">
              Medical Dietary Guidelines
            </h1>
            <div className="grid grid-cols-2 gap-4 justify-items-center items-center">
              <div className="input-bg bottom-shadow w-52 flex items-center justify-between pl-4 pr-4">
                <label htmlFor="">Low Sugar</label>
                <input type="radio" name="low-sugar" id="low-sugar" />
              </div>
              <div className="input-bg bottom-shadow w-52 flex items-center justify-between pl-4 pr-4">
                <label htmlFor="">Low Sodium</label>
                <input type="radio" name="low-sodium" id="low-sodium" />
              </div>
              <div className="input-bg bottom-shadow w-52 flex items-center justify-between pl-4 pr-4">
                <label htmlFor="">High Protein</label>
                <input type="radio" name="high-protein" id="high-protein" />
              </div>
              <div className="input-bg bottom-shadow w-52 flex items-center justify-between pl-4 pr-4">
                <label htmlFor="">Low Fat</label>
                <input type="radio" name="low-fat" id="low-fat" />
              </div>
            </div>
          </div>

          <div className="target-goals">
            <h1 className="text-xl font-medium pb-4">
              Target Goals
            </h1>
            <div className="grid grid-cols-2 gap-4 justify-items-center items-center">
              <div className="input-bg bottom-shadow w-52 flex items-center gap-4 pl-4">
                <input type="radio" name="weight-loss" id="weight-loss" />
                <label htmlFor="">Weight Loss</label>
              </div>
              <div className="input-bg bottom-shadow w-52 flex items-center gap-4 pl-4">
                <input type="radio" name="weight-gain" id="weight-gain" />
                <label htmlFor="">Weight Gain</label>
              </div>
              <div className="input-bg bottom-shadow w-52 flex items-center gap-4 pl-4">
                <input type="radio" name="maintain-weight" id="maintain-weight" />
                <label htmlFor="">Maintain Weight</label>
              </div>
              <div className="input-bg bottom-shadow w-52 flex items-center gap-4 pl-4">
                <input type="radio" name="blood-sugar" id="blood-sugar" />
                <label htmlFor="">Improve Blood Sugar</label>
              </div>
            </div>
          </div>

          <div>
            <button>Previous</button>
            <button>Continue</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUpHealth;
