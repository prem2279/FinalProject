import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const LogoLink = () => {
    if (isLoggedIn) {
      return <Link to="/dashboard" className="logo-link">Car Recommender</Link>;
    }
    return <Link to="/" className="logo-link">Car Recommender</Link>;
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <LogoLink />
      </div>
      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/recommendations">Recommendations</Link></li>
            <li><Link to="/preferences">Preferences</Link></li>
            <li><Link to="/login" onClick={logout}>Logout</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;