import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import CarCard from '../../components/CarCard/CarCard';
import './Favorites.css'; // We'll create similar styling
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Favorites = () => {
    const [favoriteCars, setFavoriteCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {

                const dashboardData = JSON.parse(sessionStorage.getItem('dashboardData'));
                setFavoriteCars(dashboardData.favorites);


            } catch (err) {
                console.error('Error fetching favorites:', err);
                setError('Failed to load favorites');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [isLoggedIn]);

    const handleViewDetails = (car) => {
        navigate(`/car/${car.id}`, {
            state: {
                car,
                fromFavorites: true
            }
        });
    };


    if (loading) return <div className="favorites"><p>Loading favorites...</p></div>;
    if (error) return <div className="favorites"><p>{error}</p></div>;

    return (
        <div className="recommendations">
            <h1>Your Favorite Cars</h1>
            <div className="car-list">
                {favoriteCars.length > 0 ? (
                    favoriteCars.map((car) => (
                        <CarCard
                            key={car.id}
                            car={car}
                            onViewDetails={() => handleViewDetails(car)}
                        />
                    ))
                ) : (
                    <p>You haven't added any cars to favorites yet.</p>
                )}
            </div>
        </div>
    );
};

export default Favorites;