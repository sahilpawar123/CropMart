// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link,
} from "react-router-dom";
import useAuthStore from "./store/authStore";

// --- Import All Your Page Components ---
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import History from "./pages/History";
import TraderDashboard from "./pages/TraderDashboard";
import FarmerPage from './pages/FarmerPage';
import MyListingsPage from './pages/MyListingsPage'; 
import ListingDetailPage from './pages/ListingDetailPage';
import FarmerBidViewPage from './pages/FarmerBidViewPage'; // The new page for farmers

// --- Helper components for routing and security ---

const AuthGuard = () => {
  const { user } = useAuthStore();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const RoleGuard = ({ role }) => {
    const { user } = useAuthStore();
    if (user.role !== role) {
        const defaultPageRoute = user.role === 'farmer' ? '/my-listings' : '/dashboard';
        return <Navigate to={defaultPageRoute} />;
    }
    return <Outlet />;
}

const MainLayout = () => {
  const { user, logout } = useAuthStore();
  return (
    <div>
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex gap-4">
          
          {/* --- CORRECTED: Role-Based Navigation Links --- */}
          {user.role === 'trader' && (
            <>
              <Link to="/dashboard" className="font-semibold hover:text-green-500">Dashboard</Link>
              <Link to="/history" className="font-semibold hover:text-green-500">History</Link>
            </>
          )}
          {user.role === 'farmer' && (
            <>
              <Link to="/my-listings" className="font-semibold hover:text-green-500">My Listings</Link>
              <Link to="/farmer" className="font-semibold hover:text-green-500">List a Crop</Link>
            </>
          )}
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

const RootHandler = () => {
  const { user } = useAuthStore();
  return user ? <Navigate to={user.role === 'farmer' ? '/my-listings' : '/dashboard'} /> : <Welcome />;
};


// ====================================================================================
// --- THE FINAL APP COMPONENT WITH CORRECTED ROUTING ---
// ====================================================================================
function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes (No Layout) --- */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RootHandler />} />

        {/* --- Protected Routes --- */}
        <Route element={<AuthGuard />}>
          <Route element={<MainLayout />}>
            
            {/* --- Trader-Specific Routes --- */}
            <Route element={<RoleGuard role="trader" />}>
              <Route path="dashboard" element={<TraderDashboard />} />
              <Route path="history" element={<History />} />
              <Route path="auction/:id" element={<ListingDetailPage />} />
            </Route>

            {/* --- Farmer-Specific Routes --- */}
            <Route element={<RoleGuard role="farmer" />}>
              <Route path="farmer" element={<FarmerPage />} />
              <Route path="my-listings" element={<MyListingsPage />} />
              {/* CORRECTED: Added the missing route for the farmer's bid view page */}
              <Route path="my-listings/:id" element={<FarmerBidViewPage />} />
            </Route>

          </Route>
        </Route>

        {/* --- "Not Found" Catch-All Route --- */}
        <Route path="*" element={<h1 className="p-8 text-2xl">404: Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;