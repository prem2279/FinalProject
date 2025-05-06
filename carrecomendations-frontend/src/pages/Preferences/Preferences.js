import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PreferenceForm from '../../components/PreferenceForm/PreferenceForm';
import './Preferences.css';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
const Preferences = ({scrollToTop}) => {
  const [preferences, setPreferences] = useState(() => {
    const tempPrefs = JSON.parse(sessionStorage.getItem('preferences'));
    if (tempPrefs) return tempPrefs;
  
    const dashboardData = JSON.parse(sessionStorage.getItem('dashboardData'));
    if (dashboardData?.preferences) return dashboardData.preferences;
  
    return {
      bodyStyle: [],
      engineType: [],
      exhaust: [],
      tyres: [],
      fuelType: [],
      transmission: [],
      seatingCapacity: [],
      priceRange: { min: 0, max: 100000 }
    };
  });
  
console.log(preferences,"fed")
  const [availableOptions, setAvailableOptions] = useState({});
  const [loaded, setLoaded] = useState(false); // 👈 control rendering
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.getPreferences();
        setAvailableOptions(response.data.data);
      } catch (error) {
        console.error('Error fetching options:', error);
        alert('Error fetching options');
      }
      finally {
        setLoaded(true); // ✅ render form only after this
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if (isLoggedIn) {
        const dashboardData = JSON.parse(sessionStorage.getItem('dashboardData'));
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (dashboardData) {
          console.log(preferences,"fdf")
          dashboardData.preferences = preferences
          sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
        }
        try{
          const response = await api.updatePreferences(userData.id,preferences);
          alert('Preferences Updated Successfully');
          navigate('/dashboard');
        }catch(error){
          alert(error.response?.data?.error);
          console.error('Error in updating preferences:', error);
        }
      } else {
        sessionStorage.setItem('preferences', JSON.stringify(preferences));
        const response = await api.getRecommendations(preferences);
        const cars = response.data.data;
        sessionStorage.setItem('recommendedCars', JSON.stringify(cars));
        navigate('/recommendations', { state: { cars } });
      }

      
    } catch (error) {
      console.error('Error submitting preferences:', error);
      alert(error.response?.data?.error);
    }
  };

  return (
    <div className="preferences">
      <h1>Set Your Preferences</h1>
      {loaded && (<PreferenceForm
        preferences={preferences}
        setPreferences={setPreferences}
        onSubmit={handleSubmit}
        scrollToTop={scrollToTop}
        availableOptions={availableOptions}
        wrapOptions={false}
      />)}
    </div>
  );
};

export default Preferences;