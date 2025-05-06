import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import CarCard from '../../components/CarCard/CarCard';
import './Recommendations.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Recommendations = () => {
  const [recommendedCars, setRecommendedCars] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (isLoggedIn) {
        const dashboardData = JSON.parse(sessionStorage.getItem('dashboardData'));
        if (dashboardData?.preferences) {
          try {
            const response = await api.getRecommendations(dashboardData.preferences);
            const cars = response.data.data;
            setRecommendedCars(cars);
          } catch (error) {
            console.error('Error fetching recommendations:', error);
            // Fallback to session storage if API fails
            const cars = JSON.parse(sessionStorage.getItem('recommendedCars')) || [];
            setRecommendedCars(cars);
          }
        }
      } else {
        const cars = location.state?.cars ||
          JSON.parse(sessionStorage.getItem('recommendedCars')) || [];
        setRecommendedCars(cars);
      }
    };

    fetchRecommendations();
  }, [location.state, isLoggedIn]);

  const handleUpdatePreferences = () => {
    navigate('/preferences');
  };

  const handleViewDetails = async (car) => {
    try {
      //setLoadingDetails(true);
      // Call your API to get detailed car information
      if(isLoggedIn){
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const response = await api.getCarDetails(userData.id,car.id); // Adjust this to match your API endpoint

        if(response){
          navigate(`/car/${car.id}`, {
            state: {
              car: car, // Pass the detailed car data
              fromRecommendations: true
            }
          });
        }else{
          alert(`Failed to view ${car.make} ${car.model} Details`);
        }
        
      }else{
        navigate(`/car/${car.id}`, {
          state: {
            car: car, // Pass the detailed car data
            fromRecommendations: true
          }
        });
      }
      
      
    } catch (error) {
      console.error('Error fetching car details:', error);
      // Fallback to the basic car data if API fails
      navigate(`/car/${car.id}`, {
        state: {
          car,
          fromRecommendations: true
        }
      });
    } finally {
      //setLoadingDetails(false);
    }
  };


  return (
    <div className="recommendations">
      <h1>Your Recommendations</h1>
      <div className="car-list">
        {recommendedCars.length > 0 ? (
          recommendedCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onViewDetails={() => handleViewDetails(car)}
            />
          ))
        ) : (
          <p>No cars match your preferences. Try adjusting your criteria.</p>
        )}
      </div>
      {!isLoggedIn && (
        <div className="button-container">
          <button className="updatepref" onClick={handleUpdatePreferences}>
            Update Preferences
          </button>
        </div>
      )}
    </div>
  );
};

export default Recommendations;