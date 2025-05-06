import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './CarDetails.css';
import api from '../../services/api';
import LoginPromptModal from '../../components/LoginPromptModal/LoginPromptModal';

const CarDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const car = state?.car;
  useEffect(() => {
    // Check if car is in favorites when component mounts
    const checkIfFavorite = () => {
      const dashboardData = JSON.parse(sessionStorage.getItem('dashboardData'));
      if (dashboardData?.favorites) {
        const found = dashboardData.favorites.some(fav => fav.id === car?.id);
        setIsFavorite(found);
      }
    };
    checkIfFavorite();
  }, [car?.id]);
  const handleBack = () => {
    if (state?.fromRecommendations) {
      navigate('/recommendations');
    } else if (state?.fromFavorites) {
      navigate('/favorites');
    } else {
      navigate('/dashboard');
    }
  };

  const handleAddToFavorites = async () => {
    try {
      const isLoggedIn = sessionStorage.getItem('token');

      if (!isLoggedIn) {
        setShowLoginPrompt(true);
        return;
      }

      const userData = JSON.parse(sessionStorage.getItem('userData'));

      if (isFavorite) {
        // Remove from favorites
        await api.removeFavorite(userData.id, car.id);
        const dashboardData = JSON.parse(sessionStorage.getItem('dashboardData'));
        if (dashboardData) {
          dashboardData.favorites = dashboardData.favorites.filter(fav => fav.id !== car.id);
          sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
        }
        setIsFavorite(false);
        alert(`${car.make} ${car.model} removed from favorites!`);
      } else {
        // Add to favorites
        const favCar = await api.addToFavorites(userData.id, car.id);
        const dashboardData = JSON.parse(sessionStorage.getItem('dashboardData'));
        if (dashboardData) {
          dashboardData.favorites.push(favCar.data.data);
          sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
        }
        setIsFavorite(true);
        alert(`${car.make} ${car.model} added to favorites!`);
      }
    } catch (err) {
      alert(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`);
      console.error(err);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { fromCarDetails: true, carId: car._id } });
  };

  if (!car) {
    return (
      <div className="car-details">
        <Navbar />
        <div className="car-content">
          <p>Car not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="car-details">
      <div className="car-content">
        <img src={car.imageUrl} alt={`${car.make} ${car.model}`} />
        <div className="car-info">
          <h1>{car.make} {car.model} ({car.year})</h1>
          <p className="price">${car.price?.toLocaleString()}</p>
          {car.description && <p className="description">{car.description}</p>}

          <div className="car-specs">
            <p><strong>Body Style:</strong> {car.bodyStyle}</p>
            <p><strong>Engine Type:</strong> {car.engineType}</p>
            <p><strong>Exhaust:</strong> {car.exhaust}</p>
            <p><strong>Tyres:</strong> {car.tyres}</p>
            <p><strong>Fuel Type:</strong> {car.fuelType}</p>
            <p><strong>Transmission:</strong> {car.transmission}</p>
            <p><strong>Seating Capacity:</strong> {car.seatingCapacity}</p>
          </div>

          <div className="car-actions">
            <button className="back-button" onClick={handleBack}>
              Back to {
                state?.fromFavorites ? 'Favorites' :
                  state?.fromRecommendations ? 'Recommendations' : 'Home'
              }
            </button>
            <button
              className={`favorite-button ${isFavorite ? 'remove-favorite' : ''}`}
              onClick={handleAddToFavorites}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>

      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={handleLoginRedirect}
      />
    </div>
  );
};

export default CarDetails;