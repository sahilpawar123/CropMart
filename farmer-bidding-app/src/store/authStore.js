// src/store/authStore.js
import { create } from 'zustand';
import axios from 'axios'; // Import axios to make API calls

// --- Helper function to set the auth token in Axios headers ---
const setAuthToken = (token) => {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['x-auth-token'];
  }
};


const useAuthStore = create((set, get) => ({
  // --- STATE ---
  user: null, // Start with no user logged in
  token: localStorage.getItem('token'), // Get token from localStorage if it exists
  isAuthenticated: null, // Track if authentication status is known
  loading: true, // Start in loading state until we check for a token

  // --- ACTIONS ---

  /**
   * Load User: Checks if a token exists in localStorage and verifies it with the backend.
   * This keeps the user logged in if they refresh the page.
   */
  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token); // Set Axios headers
      try {
        // You need to create this backend route: GET /api/auth
        // It should verify the token and return user data (excluding password)
        const res = await axios.get('http://localhost:5000/api/auth'); 
        set({ user: res.data, isAuthenticated: true, loading: false, token: token });
      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false, loading: false });
        setAuthToken(null);
      }
    } else {
        set({ loading: false }); // No token, just stop loading
    }
  },

  /**
   * Login User: Gets token from backend, saves it, loads user data.
   * @param {object} userData - The user object from the backend login response.
   * @param {string} token - The JWT token from the backend login response.
   */
  loginSuccess: (userData, token) => {
    localStorage.setItem('token', token); // Save token to localStorage
    setAuthToken(token); // Set Axios headers
    set({ user: userData, token: token, isAuthenticated: true, loading: false });
  },

  /**
   * Logout User: Clears token, user data, and resets headers.
   */
  logout: () => {
    localStorage.removeItem('token'); // Remove token from storage
    setAuthToken(null); // Clear Axios headers
    set({ token: null, user: null, isAuthenticated: false, loading: false });
  },
}));

// --- IMPORTANT: Call loadUser when the app initializes ---
// This attempts to log the user in if a valid token exists in storage.
useAuthStore.getState().loadUser(); 

export default useAuthStore;