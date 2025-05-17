import React, { useState, useContext, useEffect } from 'react'
import SignupProgress from './SignUp Form Components/SignupProgress';
import './SignUpForm.css'
import SignUpBasic from './SignUp Form Components/SignUpBasic';
import SignUpHealth from './SignUp Form Components/SignUpHealth';
import SignUpPreference from './SignUp Form Components/SignUpPreference';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { LoggedInContext, UserIDContext } from '../../contexts/loginContext';


function SignUpForm() {
    const [formPage, setFormPage] = useState(0); // There will be 3 steps in a sign up form [0, 1, 2]
    const {register, handleSubmit, watch, formState} = useForm({
        defaultValues: {
            // Add any default values here
        },
        mode: 'onChange'
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [networkStatus, setNetworkStatus] = useState('online');
    const [retryCount, setRetryCount] = useState(0);
    const navigate = useNavigate();
    const { setLoggedIn } = useContext(LoggedInContext);
    const { setUserID } = useContext(UserIDContext);

    // Check network status on load and when it changes
    useEffect(() => {
        const handleOnline = () => setNetworkStatus('online');
        const handleOffline = () => setNetworkStatus('offline');

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        // Set initial status
        setNetworkStatus(navigator.onLine ? 'online' : 'offline');

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // This function will be called when the final form is submitted
    const onSubmit = async (data) => {
        if (networkStatus === 'offline') {
            setError('You are currently offline. Please check your internet connection and try again.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        
        // Format the data to match backend expectations
        const formattedData = {
            // Basic info
            username: data.username,
            email: data.email,
            password: data.password,
            phoneNumber: data.phone,
            
            // Health data
            age: parseInt(data.age),
            gender: data.gender,
            weight: parseInt(data.weight),
            height: parseInt(data.height),
            chronicConditions: Array.isArray(data.chronic) ? data.chronic.join(',') : data.chronic || '',
            allergies: Array.isArray(data.restrictions) 
                ? data.restrictions.join(',') + (data.other_allergies ? ',' + data.other_allergies : '') 
                : (data.restrictions || '') + (data.other_allergies ? ',' + data.other_allergies : ''),
            dietaryRestrictions: Array.isArray(data.restrictions) ? data.restrictions.join(',') : data.restrictions || '',
            medications: data.optional_medications || '',
            goals: Array.isArray(data.goals) ? data.goals.join(',') : data.goals || '',
            
            // Preferences
            cuisinePref: Array.isArray(data.cuisines) ? data.cuisines.join(',') : data.cuisines || '',
            avoid: Array.isArray(data.dislikes) ? data.dislikes.join(',') : data.dislikes || '',
            mealTypePref: data.type_pref || '',
            cookTimePref: data.cooktimePref || '',
            prefIngredients: Array.isArray(data.prefIngredients) ? data.prefIngredients.join(',') : data.prefIngredients || '',
            mealFreq: data.mealsPerDay || '3',
            mealTimings: Array.isArray(data.prefMealTime) ? data.prefMealTime.join(',') : data.prefMealTime || '',
        };

        console.log('Submitting form data:', formattedData);
        
        try {
            console.log('Starting account registration request...');
            // Increase the timeout for account creation
            const response = await fetch('/api/account/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
                // Use a longer timeout since account creation involves meal generation
                signal: AbortSignal.timeout(60000) // 60 second timeout
            });

            // Check if the response is valid before parsing JSON
            const responseText = await response.text();
            console.log('Server response:', response.status, responseText.substring(0, 200));
            let result;
            
            try {
                // Try to parse the response as JSON
                result = responseText && responseText.trim() ? JSON.parse(responseText) : {};
            } catch (parseError) {
                console.error("Failed to parse server response:", parseError);
                console.error("Raw response:", responseText);
                throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}...`);
            }
            
            if (response.status === 201) {
                // Successful account creation
                console.log('Account created successfully:', result);
                // Set login state
                setLoggedIn(true);
                setUserID(result.data.userID);
                
                // Store user info in localStorage
                localStorage.setItem('userID', result.data.userID);
                localStorage.setItem('username', result.data.username);
                localStorage.setItem('isLoggedIn', 'true');
                
                // Navigate to dashboard
                navigate('/dashboard/main');
            } else {
                // Error creating account
                setError(result.error || 'Failed to create account. Please try again.');
                setFormPage(0); // Return to first page on error
            }
        } catch (error) {
            console.error('Error during account creation:', error);
            if (!navigator.onLine) {
                setError('You are offline. Please check your internet connection and try again.');
            } else if (error.name === 'AbortError') {
                setError('Request timed out. The server might be busy, please try again with fewer preferences.');
            } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                setError('Unable to connect to the server. Please make sure the backend is running and try again.');
            } else if (error.message && (error.message.includes('socket hang up') || error.message.includes('ECONNRESET'))) {
                setError('The connection was interrupted. This happens when meal plan generation takes too long. Try again with fewer preferences and allergies.');
                
                // Auto-retry once with a delay for better user experience
                if (retryCount < 1) {
                    setTimeout(() => {
                        console.log('Auto-retrying account creation with simplified form...');
                        // Make a copy of the form data with fewer preferences
                        const simplifiedData = { ...watch() };
                        
                        // Simplify data before retrying
                        if (Array.isArray(simplifiedData.prefIngredients)) {
                            simplifiedData.prefIngredients = simplifiedData.prefIngredients.slice(0, 2);
                        }
                        if (Array.isArray(simplifiedData.goals)) {
                            simplifiedData.goals = simplifiedData.goals.slice(0, 2);
                        }
                        
                        onSubmit(simplifiedData);
                    }, 2000);
                }
            } else if (error.message && error.message.includes('invalid JSON')) {
                setError('The server response was invalid. This could be due to server maintenance. Please try again in a few moments.');
            } else if (error.name === 'SyntaxError') {
                setError('There was a problem with the server response. Try again later or contact support if the issue persists.');
            } else {
                // Log the actual error for better debugging
                console.error('Detailed error:', error);
                setError('A server error occurred. This might be because meal plan generation is taking too long. Please try again with simpler preferences.');
            }
            // Increment retry count for metrics
            setRetryCount(prev => prev + 1);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Retry submission function
    const handleRetry = () => {
        const currentData = watch();
        onSubmit(currentData);
    };

    const formToDisplay = () => {
        if (formPage === 0) {
            return <SignUpBasic setFormPage={setFormPage} register={register} handleSubmit={handleSubmit} watch={watch} formState={formState}/>
        } else if (formPage === 1) {
            return <SignUpHealth setFormPage={setFormPage} register={register} handleSubmit={handleSubmit} watch={watch}/>
        } else if (formPage === 2) {
            return <SignUpPreference setFormPage={setFormPage} register={register} handleSubmit={handleSubmit} watch={watch} onFinalSubmit={onSubmit} isSubmitting={isSubmitting}/>
        }
    }

    return (
        <>
            <div>
                {error && (
                    <div className="mx-auto max-w-md mt-4 p-3 text-sm text-red-800 border border-red-300 rounded-md bg-red-50">
                        <p className="font-medium">{error}</p>
                        {(error.includes('network') || error.includes('connection') || error.includes('offline') || error.includes('server')) && (
                            <div className="mt-2">
                                <button 
                                    onClick={handleRetry}
                                    disabled={isSubmitting || networkStatus === 'offline'}
                                    className={`text-white py-1 px-3 rounded text-xs mr-2 ${networkStatus === 'offline' ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {isSubmitting ? 'Retrying...' : 'Retry Submission'}
                                </button>
                                <span className={`inline-flex items-center text-xs ${networkStatus === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                                    {networkStatus === 'online' ? '● Online' : '● Offline'}
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <SignupProgress formPage={formPage} />
                <div>{formToDisplay()}</div>
            </div>
        </>
    )
}

export default SignUpForm