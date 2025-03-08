import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import './index.css';

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [registerData, setRegisterData] = useState({ username: '', email: '', mobile: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setError(null);
  };

  const handleChange = (e) => {
    if (isRegister) {
      setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    } else {
      setLoginData({ ...loginData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const url = `http://localhost:3005/api/users/${isRegister ? 'register' : 'login'}`;
    const formData = isRegister ? registerData : loginData;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      data.token && Cookies.set('jwt_token')
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setError(isRegister ? 'Registration successful! Redirecting to login...' : 'Login successful! Redirecting...');
      setLoading(false);

      setTimeout(() => {
        if (isRegister) {
          setIsRegister(false);
        } else {
          navigate('/');
        }
      }, 500);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-bg">
      <div className={`auth-container ${isRegister ? 'register' : 'login'}`}>
        <div className={`left-container ${isRegister ? 'slide-in' : 'slide-out'}`}>
          {isRegister ? (
            <div className="register-form">
              <h2>Create an account</h2>
              <p>Your personal job finder is here</p>
              {error && <p className="error">{error}</p>}
              {loading && <p className="loading">Loading...</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" name="username" value={registerData.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={registerData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Mobile</label>
                  <input type="number" name="mobile" value={registerData.mobile} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={registerData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Show Password Checkbox */}
                <div className="show-password-container">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={togglePasswordVisibility}
                  />
                  <label htmlFor="showPassword" className="show-password-label">
                    Show Password
                  </label>
                </div>
                <p className="agreement-text">
                  By creating an account, I agree to our <a href="/terms" target="_blank" rel="noopener noreferrer">terms of use</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>.
                </p>
                <button type="submit">Create Account</button>
              </form>
              <p>
                Already have an account? <span onClick={toggleForm} className="toggle-link">Sign In</span>
              </p>
            </div>
          ) : (
            <div className="login-image">
              <div className="overlay">
                <h1>Welcome Back!</h1>
                <p>Continue your journey with us.</p>
              </div>
            </div>
          )}
        </div>

        <div className={`right-container ${isRegister ? 'slide-out' : 'slide-in'}`}>
          {isRegister ? (
            <div className="register-image">
              <div className="overlay">
                <h1>Find Your Dream Job</h1>
                <p>Join us and take the first step towards your career.</p>
              </div>
            </div>
          ) : (
            <div className="login-form">
              <h2>Already have an account?</h2>
              <p>Your personal job finder is here</p>
              {error && <p className="error">{error}</p>}
              {loading && <p className="loading">Loading...</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={loginData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Show Password Checkbox */}
                <div className="show-password-container">
                  <input
                    type="checkbox"
                    id="showPasswordLogin"
                    checked={showPassword}
                    onChange={togglePasswordVisibility}
                  />
                  <label htmlFor="showPasswordLogin" className="show-password-label">
                    Show Password
                  </label>
                </div>
                <button type="submit">Sign In</button>
              </form>
              <p>
                Don't have an account? <span onClick={toggleForm} className="toggle-link">Sign Up</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;