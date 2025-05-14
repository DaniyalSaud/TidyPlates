import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import { LoggedInContext, UserIDContext } from '../../contexts/loginContext';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setLoggedIn } = useContext(LoggedInContext);
  const { setUserID } = useContext(UserIDContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Using relative URL instead of hardcoded Codespaces URL
      const response = await fetch('api/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies if needed for session management
      });

      const data = await response.json();

      if (response.status === 302 || response.status === 200) {
        // Login successful
        console.log('Login successful:', data);
        setLoggedIn(true);
        setUserID(data.data.userID);
        
        // Store user info in localStorage for persistence
        localStorage.setItem('userID', data.data.userID);
        localStorage.setItem('username', data.data.username);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect to dashboard
        navigate('/dashboard/main');
      } else {
        // Login failed
        setError(data.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="login-logo">
            <h2 className="text-3xl font-bold text-red-700">TidyPlates</h2>
          </Link>
        </div>
        
        <div className="login-content">
          <div className="login-art">
            <div className="login-image">
              <img src="/Landing Page Assets/landing-page-fruits.png" alt="Healthy Food" />
            </div>
            <div className="login-tagline">
              <h2>Organize Your Meals,</h2>
              <h2>Simplify Your Life</h2>
              <p>Join thousands of users who are transforming their meal planning experience.</p>
            </div>
          </div>
          
          <div className="login-form-container">
            <div className="form-header">
              <h1>Welcome Back</h1>
              <p>Log in to your TidyPlates account</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                  />
                  <label htmlFor="remember-me">
                    Remember me
                  </label>
                </div>
                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`login-button ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? 'Logging in...' : 'Sign in'}
              </button>
            </form>

            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="signup-link">
                  Sign up
                </Link>
              </p>
            </div>
            
            <div className="login-social">
              <div className="social-divider">
                <span>Or continue with</span>
              </div>
              <div className="social-buttons">
                <button className="social-button google">
                  <span>Google</span>
                </button>
                <button className="social-button facebook">
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;