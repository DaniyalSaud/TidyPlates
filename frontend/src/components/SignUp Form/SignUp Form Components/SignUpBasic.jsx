import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function SignUpBasic({ setFormPage, register, handleSubmit, watch, formState }) {
  const [usernameError, setUsernameError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [canProceed, setCanProceed] = useState(true);
  
  const watchUsername = watch("username", "");
  const watchPassword = watch("password", "");
  const watchConfirmPassword = watch("confirm-password", "");

  // Check username availability when username changes
  useEffect(() => {
    // Clear error when empty or too short
    if (!watchUsername || watchUsername.length < 4) {
      setUsernameError("");
      setCanProceed(true);
      return;
    }

    const checkUsernameAvailability = async () => {
      setIsCheckingUsername(true);
      try {
        const response = await fetch(`api/account/check-username?username=${encodeURIComponent(watchUsername)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const result = await response.json();
        
        if (response.status === 200) {
          if (result.available) {
            setUsernameError("");
            setCanProceed(true);
          } else {
            setUsernameError("Username is already taken");
            setCanProceed(false);
          }
        } else {
          console.error("Error checking username:", result.error);
        }
      } catch (error) {
        console.error("Error checking username availability:", error);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    // Debounce the API call to avoid too many requests
    const timer = setTimeout(() => {
      checkUsernameAvailability();
    }, 500);

    return () => clearTimeout(timer);
  }, [watchUsername]);

  // Check password match
  useEffect(() => {
    // Only validate if both fields have values
    if (watchPassword && watchConfirmPassword) {
      if (watchPassword !== watchConfirmPassword) {
        setPasswordMatchError("Passwords don't match");
        setCanProceed(false);
      } else {
        setPasswordMatchError("");
        setCanProceed(!usernameError);
      }
    } else {
      setPasswordMatchError("");
    }
  }, [watchPassword, watchConfirmPassword, usernameError]);

  const handleFormChange = (data) => {
    // Additional validation before proceeding
    if (!canProceed || usernameError || passwordMatchError) {
      return; // Prevent form submission
    }

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
                    required: "Username is required",
                    minLength: {
                      value: 4,
                      message: "Username must be at least 4 characters"
                    },
                    maxLength: {
                      value: 20,
                      message: "Username must be at most 20 characters"
                    },
                  })}
                  className={`input-field bottom-shadow ${usernameError ? "border-2 border-red-500" : ""}`}
                />
                {formState.errors.username && (
                  <span className="text-xs text-red-500 pl-1 pt-1">
                    {formState.errors.username.message}
                  </span>
                )}
                {isCheckingUsername && (
                  <span className="text-xs text-blue-500 pl-1 pt-1">
                    Checking username...
                  </span>
                )}
                {usernameError && (
                  <span className="text-xs text-red-500 pl-1 pt-1">
                    {usernameError}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="pl-1 font-semibold" htmlFor="email">
                  Email
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email"
                    }
                  })}
                  className={`input-field bottom-shadow ${formState.errors.email ? "border-2 border-red-500" : ""}`}
                />
                {formState.errors.email && (
                  <span className="text-xs text-red-500 pl-1 pt-1">
                    {formState.errors.email.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="pl-1 font-semibold" htmlFor="password">
                  Password
                </label>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    }
                  })}
                  type="password"
                  className={`input-field bottom-shadow ${formState.errors.password ? "border-2 border-red-500" : ""}`}
                />
                {formState.errors.password && (
                  <span className="text-xs text-red-500 pl-1 pt-1">
                    {formState.errors.password.message}
                  </span>
                )}
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
                    required: "Please confirm your password",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    },
                    validate: (value) => value === watch("password") || "Passwords don't match"
                  })}
                  type="password"
                  className={`input-field bottom-shadow ${formState.errors["confirm-password"] || passwordMatchError ? "border-2 border-red-500" : ""}`}
                />
                {formState.errors["confirm-password"] && (
                  <span className="text-xs text-red-500 pl-1 pt-1">
                    {formState.errors["confirm-password"].message}
                  </span>
                )}
                {passwordMatchError && !formState.errors["confirm-password"] && (
                  <span className="text-xs text-red-500 pl-1 pt-1">
                    {passwordMatchError}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="pl-1 font-semibold" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                    min: {
                      value: 0,
                      message: "Please enter a valid phone number"
                    },
                    max: {
                      value: 99999999999,
                      message: "Please enter a valid phone number"
                    }
                  })}
                  className={`input-field bottom-shadow ${formState.errors.phone ? "border-2 border-red-500" : ""}`}
                />
                {formState.errors.phone && (
                  <span className="text-xs text-red-500 pl-1 pt-1">
                    {formState.errors.phone.message}
                  </span>
                )}
              </div>

              <a
                className="text-sm hover:text-blue-900 hover:underline pl-1"
                href="/login"
              >
                Already have an account? Sign in
              </a>

              <div className="pt-4 ml-auto">
                <button
                  type="submit"
                  disabled={!canProceed || isCheckingUsername || Object.keys(formState.errors).length > 0}
                  className={`bg-white bottom-shadow h-10 rounded-lg w-20 hover:bg-gray-200 transition duration-100 ease-in-out active:bg-gray-300 
                    ${(!canProceed || isCheckingUsername || Object.keys(formState.errors).length > 0) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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
