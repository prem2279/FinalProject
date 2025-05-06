import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './Home.css';

import { useNavigate } from 'react-router-dom';



const Home = () => {

  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/preferences'); // Navigates to Preferences page
  };
  
  return (
    <div className="home">
      {/* <Navbar /> */}
      
      <div className="hero">
        <h1>Find Your Perfect Car</h1>
        <p>Discover cars tailored to your preferences.</p>
        <button onClick={handleGetStarted}>Get Started</button>
        </div>
    </div>
  );
};

export default Home;