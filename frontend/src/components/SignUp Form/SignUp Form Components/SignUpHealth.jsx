import React from "react";
import SignupProgress from "./SignupProgress";

const SignUpHealth = ({ setFormPage, register, handleSubmit, watch }) => {
  const handleFormChange = (data) => {
    setFormPage((curr) => {
      if (curr === 2) {
        console.log("Form submitted");
      }
      return curr + 1;
    });
    window.scrollTo({ top: 0, behavior: "instant" });
    console.log("Printing form data: ", data)
  };

  const handleGoBack = () => {
    setFormPage((curr) => curr - 1);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <>
      <div className="health-data w-4/5 mx-auto rounded-lg shadow-lg bg-gray-50 pt-4 pb-4 pl-10 pr-10 mb-6">
        <h1 className="sign-up-form-top-heading pb-8">Health Data</h1>
        <form onSubmit={handleSubmit(handleFormChange)}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col gap-2 justify-center items-center">
              <label htmlFor="age">Age</label>
              <input
                {...register("age", {
                  required: true,
                  min: 2,
                  max: 100,
                  valueAsNumber: true,
                }
                )}
                className="input-bg bottom-shadow w-16 pl-5 "
              />
            </div>

            <div className="gender-select flex flex-col gap-2 justify-center items-center">
              <h1>Gender</h1>
              <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-24">
                <input id="male" type="radio" {...register("gender", {
                  required: true,
                })} value="male" />
                <label className="pl-4" htmlFor="male">
                  Male
                </label>
              </div>
              <div className="input-bg bottom-shadow flex items-center p-2 w-24">
                <input id="female" type="radio" {...register("gender", {
                  required: true,
                })} value="female" />
                <label className="pl-4" htmlFor="female">
                  Female
                </label>
              </div>
              <div></div>
            </div>

            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="w-44 flex justify-between items-center gap-4">
                <label htmlFor="weight">Weight (Kg)</label>
                <input
                  {...register("weight", {
                    required: true,
                    min: 0,
                    valueAsNumber: true,
                  })}
                  className="input-bg bottom-shadow w-16 pl-5"
                />
              </div>

              <div className="w-44 flex justify-between items-center gap-4">
                <label htmlFor="height">Height (Inch)</label>
                <input
                  {...register("height", {
                    required: true,
                    min: 0,
                  })}
                  className="input-bg bottom-shadow w-16 pl-5"
                />
              </div>
            </div>
          </div>

          <div className="chronic-conditions">
            <h1 className="text-xl font-medium pb-4">Chronic conditions</h1>
            <div className="flex flex-col gap-4">
              <div className="row-1 flex justify-between items-center gap-4">
                <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                  <input type="checkbox" {...register("chronic")} id="diabetes" value="diabetes" />
                  <label className="pl-4" htmlFor="diabetes">
                    Diabetes
                  </label>
                </div>
                <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                  <input type="checkbox" {...register("chronic")} id="cholesterol" value="high-cholesterol" />
                  <label className="pl-4" htmlFor="cholesterol">
                    High Cholesterol
                  </label>
                </div>
                <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                  <input type="checkbox" {...register("chronic")} id="hyper-tension" value="hyper-tension" />
                  <label className="pl-4" htmlFor="hyper-tension">
                    Hyper tension
                  </label>
                </div>
              </div>

              <div className="row-2 flex justify-between items-center gap-4">
                <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                  <input type="checkbox" {...register("chronic")} id="heart-disease" value="heart-disease" />
                  <label className="pl-4" htmlFor="heart-disease">
                    Heart disease
                  </label>
                </div>
                <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                  <input type="checkbox" {...register("chronic")} id="kidney-disease" value="kidney-disease" />
                  <label className="pl-4" htmlFor="kidney-disease">
                    Kidney disease
                  </label>
                </div>
                <div className="input-bg bottom-shadow flex items-center p-2 pr-4 w-44">
                  <input type="checkbox" {...register("chronic")} id="liver-disease" value="liver-disease" />
                  <label className="pl-4" htmlFor="liver-disease">
                    Liver disease
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="other-condition flex justify-between items-center pt-4 pb-4">
            <input
              className="input-bg bottom-shadow p-2 w-3/5 mx-auto"
              {...register("other_health_condition_str",{
                required: false
              })}
              placeholder="Other conditions....."
            />
          </div>

          <div className="allergy">
            <h1 className="text-xl font-medium pb-4">
              Allergies and Dietary Restrictions
            </h1>
            <div className="flex flex-wrap gap-x-28 gap-y-10 items-center justify-center">
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="checkbox" {...register("restrictions")} id="gluten-free" value="gluten-free" />
                <label className="pl-4" htmlFor="gluten-free">
                  Gluten-free
                </label>
              </div>
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="checkbox" {...register("restrictions")} id="dairy-free" value="dairy-free" />
                <label className="pl-4" htmlFor="dairy-free">
                  Dairy-free
                </label>
              </div>
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="checkbox" {...register("restrictions")} id="nut-allergy" value="nut-allergy" />
                <label className="pl-4" htmlFor="nut-allergy">
                  Nut Allergy
                </label>
              </div>
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="checkbox" {...register("restrictions")} id="veg" value="veg" />
                <label className="pl-4" htmlFor="veg">
                  Vegetarian
                </label>
              </div>
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="checkbox" {...register("restrictions")} id="keto" value="keto" />
                <label className="pl-4" htmlFor="keto">
                  Keto
                </label>
              </div>
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="checkbox" {...register("restrictions")} id="fish-allergy" value="fish-allergy" />
                <label className="pl-4" htmlFor="fish-allergy">
                  Fish Allergy
                </label>
              </div>
              <div className="h-10 rounded-full bottom-shadow flex items-center p-2 pr-4 w-40">
                <input type="checkbox" {...register("restrictions")} id="vegan" value="vegan" />
                <label className="pl-4" htmlFor="vegan">
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
                <label htmlFor="low-sugar">Low Sugar</label>
                <input type="checkbox" {...register("guidelines")} id="low-sugar" value="low-sugar" />
              </div>
              <div className="input-bg bottom-shadow w-52 flex items-center justify-between pl-4 pr-4">
                <label htmlFor="low-sodium">Low Sodium</label>
                <input type="checkbox" {...register("guidelines")} id="low-sodium" value="low-sodium" />
              </div>
              <div className="input-bg bottom-shadow w-52 flex items-center justify-between pl-4 pr-4">
                <label htmlFor="high-protein">High Protein</label>
                <input type="checkbox" {...register("guidelines")} id="high-protein" value="high-protein" />
              </div>
              <div className="input-bg bottom-shadow w-52 flex items-center justify-between pl-4 pr-4">
                <label htmlFor="low-fat">Low Fat</label>
                <input type="checkbox" {...register("guidelines")} id="low-fat" value="low-fat" />
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-medium pt-4">
              Medications Affecting Diet (Optional)
            </h1>
            <div className="extra-allergy flex justify-between items-center pt-4 pb-4">
              <textarea
                className="resize-none rounded-lg bg-white h-40 bottom-shadow p-2 w-3/5 mx-auto"
                {...register("optional_medications")}
                placeholder="Example: Taking insulin or on a low-sodium diet per doctor's advice"
              />
            </div>
          </div>

          <div className="target-goals">
            <h1 className="text-xl font-medium pb-4">Target Goals</h1>
            <div className="grid grid-cols-2 gap-4 justify-items-center items-center">
              <div className="input-bg bottom-shadow w-52 flex items-center gap-4 pl-4">
                <input type="checkbox" {...register('goals')} id="weight-loss" value="weight-loss" />
                <label htmlFor="weight-loss">Weight Loss</label>
              </div>
              <div className="input-bg bottom-shadow w-52 flex items-center gap-4 pl-4">
                <input type="checkbox" {...register('goals')} id="weight-gain" value="weight-gain" />
                <label htmlFor="weight-gain">Weight Gain</label>
              </div>
              <div className="input-bg bottom-shadow w-52 flex items-center gap-4 pl-4">
                <input type="checkbox" {...register('goals')} id="maintain-weight" value="maintain-weight" />
                <label htmlFor="maintain-weight">Maintain Weight</label>
              </div>
              <div className="input-bg bottom-shadow w-52 flex items-center gap-4 pl-4">
                <input type="checkbox" {...register('goals')} id="blood-sugar" value="improve-energy" />
                <label htmlFor="blood-sugar">Improve Blood Sugar</label>
              </div>
            </div>
          </div>

          <div className="flex  items-center justify-between pt-10">
            <button
              onClick={handleGoBack}
              type="button"
              className="bg-white bottom-shadow h-10 rounded-lg w-20 hover:bg-gray-200 transition duration-100 ease-in-out active:bg-gray-300 cursor-pointer"
            >
              Previous
            </button>
            <button
              type="submit"
              className="bg-white bottom-shadow h-10 rounded-lg w-20 hover:bg-gray-200 transition duration-100 ease-in-out active:bg-gray-300 cursor-pointer"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUpHealth;
