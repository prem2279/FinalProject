import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation // Add this import
} from 'react-router-dom';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import CarDetails from './pages/CarDetails/CarDetails';
import Profile from './pages/Profile/Profile';
import Favorites from './pages/Favorites/Favorites';
import RecentActivity from './pages/RecentActivity/RecentActivity';
import Preferences from './pages/Preferences/Preferences';
import Recommendations from './pages/Recommendations/Recommendations';
import Footer from './components/Footer/Footer';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
// Protected Route Component (for authenticated users)
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};
function App() {
  const scrollableRef = useRef(null);
  const scrollToTop = () => {
    scrollableRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <div className="header">
            <Navbar />
          </div>
          <div className="content" ref={scrollableRef}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Preferences scrollToTop={scrollToTop} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup scrollToTop={scrollToTop} />} />

              {/* Preferences - Public */}
              <Route path="/preferences" element={<Preferences scrollToTop={scrollToTop} />} />

              {/* Recommendations - Public */}
              <Route path="/recommendations" element={<Recommendations />} />

              {/* Car Details - Public */}
              <Route path="/car/:id" element={<CarDetails />} />

              {/* Protected Routes (require login) */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } />

              <Route path="/recentActivity" element={
                <ProtectedRoute>
                  <RecentActivity />
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <div className="footer">
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;