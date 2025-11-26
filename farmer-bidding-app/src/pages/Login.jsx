// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { User, Store, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState('farmer'); // Default role
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((state) => state.loginSuccess);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear validation error when user starts typing
    if (errors[id]) {
        setErrors(prev => ({...prev, [id]: null}));
    }
    setApiError(''); // Clear API error on input change
  };

  // --- Keep Your Validation Logic Here ---
  const validateForm = () => {
    const newErrors = {};
    if (!isLoginView && !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    if (!isLoginView && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // ----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    if (isLoginView) {
      // --- LOGIN LOGIC ---
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        const { token, user } = response.data;
        loginSuccess(user, token);
        const redirectPath = user.role === 'farmer' ? '/farmer' : '/dashboard';
        navigate(redirectPath);
      } catch (err) {
        const message = err.response?.data?.msg || 'Login failed. Please check credentials.';
        setApiError(message);
        console.error('Login API error:', err);
      }
    } else { // --- SIGNUP LOGIC ---
      try {
        await axios.post('http://localhost:5000/api/auth/signup', {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: role,
        });
        alert('Signup successful! Please log in with your new account.');
        setIsLoginView(true);
        setFormData({ fullName: '', email: formData.email, password: '', confirmPassword: ''});
        setErrors({});
      } catch (err) {
        const message = err.response?.data?.msg || 'Signup failed. Please try again.';
        setApiError(message);
        console.error('Signup API error:', err);
      }
    }
    setIsLoading(false);
  };

  // --- FULL JSX RENDERING ---
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center -z-10 animate-kenburns"
        style={{ backgroundImage: `url('https://plus.unsplash.com/premium_photo-1663945778994-11b3201882a0?q=80&w=1920&auto=format&fit=crop')` }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-sm p-8 space-y-6 bg-white/90 backdrop-blur-md rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">{isLoginView ? 'Welcome Back!' : 'Create an Account'}</h1>
          <p className="text-gray-600 font-medium">Connecting Farmers and Traders</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setRole('farmer')}
            className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all bg-white/70 ${role === 'farmer' ? 'ring-2 ring-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'}`}
          >
            <User className="w-8 h-8 mb-2 text-green-700" />
            <span className="font-semibold text-gray-800">Farmer</span>
          </button>
          <button
            onClick={() => setRole('trader')}
            className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all bg-white/70 ${role === 'trader' ? 'ring-2 ring-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'}`}
          >
            <Store className="w-8 h-8 mb-2 text-green-700" />
            <span className="font-semibold text-gray-800">Trader</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* API Error Display */}
          {apiError && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-800 flex items-center text-sm">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Full Name (Signup Only) */}
          {!isLoginView && (
            <div>
              <label className="block text-sm font-medium text-left text-gray-700" htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" value={formData.fullName} onChange={handleInputChange} className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-left text-gray-700" htmlFor="email">Email</label>
            <input type="email" id="email" value={formData.email} onChange={handleInputChange} className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-left text-gray-700" htmlFor="password">Password</label>
            <input type="password" id="password" value={formData.password} onChange={handleInputChange} className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password (Signup Only) */}
          {!isLoginView && (
            <div>
              <label className="block text-sm font-medium text-left text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLoginView ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Toggle between Login/Signup */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => { setIsLoginView(!isLoginView); setApiError(''); setErrors({}); }}
            className="text-sm text-green-700 hover:underline font-medium"
          >
            {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;