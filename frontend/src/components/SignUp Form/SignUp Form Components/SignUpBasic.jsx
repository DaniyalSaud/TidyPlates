import React from "react";
import { useForm } from "react-hook-form";

function SignUpBasic({ setFormPage, register, handleSubmit, watch }) {


  const handleFormChange = (data) => {
    setFormPage((curr) => {
      if (curr === 2) {
        console.log("Form submitted");
      }
      return curr + 1;
    });
    window.scrollTo({ top: 0, behavior: "instant" });
    console.log("Printing form data: ", data);
  };

  return (
    <>
      <div className="top-info">
        <h1 className="text-3xl font-medium text-center">
          Set Up Your Profile
        </h1>
        <img
          src="/assets/restaurant.png"
          alt="Some icon"
          className="w-14 mx-auto pt-4 pb-4"
        />
      </div>

      <div className="basic-form-box bg-gray-300 rounded-lg mx-auto w-2/5 pt-8 pb-8 flex">
        <div className="w-92 pl-10 pr-10">
          <form onSubmit={handleSubmit(handleFormChange)}>
            <h1 className="sign-up-form-top-heading pb-8">Basic Information</h1>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1">
                <label className="pl-1 font-semibold" htmlFor="username">
                  Username
                </label>
                <input
                  {...register("username", {
                    required: true,
                    minLength: 4,
                    maxLength: 20,
                  })}
                  className="input-field bottom-shadow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="pl-1 font-semibold" htmlFor="email">
                  Email
                </label>
                <input
                  {...register("email", {
                    required: true,
                    pattern: /^\S+@\S+$/i,
                  })}
                  className="input-field bottom-shadow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="pl-1 font-semibold" htmlFor="password">
                  Password
                </label>
                <input
                  {...register("password", {
                    required: true,
                    minLength: 8,
                  })}

                  type="password"
                  className="input-field bottom-shadow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  className="pl-1 font-semibold"
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </label>
                <input
                  {...register("confirm-password", {
                    required: true,
                    minLength: 8,
                    validate: (value) => value === watch("password"),
                  })}

                  type="password"
                  className="input-field bottom-shadow"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="pl-1 font-semibold" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  {...register("phone", {
                    required: true,
                    min: 0,
                    max: 99999999999,
                  })}
                  className="input-field bottom-shadow"
                />
              </div>

              <a
                className="text-sm hover:text-blue-900 hover:underline pl-1"
                href="#"
              >
                Already have an account? Sign in
              </a>

              <div className="pt-4 ml-auto">
                <button
                  type="submit"
                  className="bg-white bottom-shadow h-10 rounded-lg w-20 hover:bg-gray-200 transition duration-100 ease-in-out active:bg-gray-300 cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUpBasic;
