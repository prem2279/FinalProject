import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Dashboard.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import {
  FaCar as CarIcon,
  FaCog as SettingsIcon,
  FaHeart as HeartIcon,
  FaUser as ProfileIcon,
  FaEye, FaTrash
} from 'react-icons/fa';
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    preferences: {
      bodyStyle: [],
      engineType: [],
      fuelType: [],
      transmission: [],
      seatingCapacity: []
    },
    statistics: {
      carsViewed: 0,
      recommendationsGenerated: 0,
      favoritesAdded: 0
    },
    favorites: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get user data from sessionStorage
  const userData = JSON.parse(sessionStorage.getItem('userData')) || {
    name: 'User',
    email: 'Not available'
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.getDashboardData();
        console.log(response.data?.data.preferences, "uikuhij")
        console.log({
          preferences: response.data?.data?.preferences || {
            bodyStyle: [],
            engineType: [],
            fuelType: [],
            transmission: [],
            seatingCapacity: []
          },
          statistics: response.data?.data?.statistics || {
            carsViewed: 0,
            recommendationsGenerated: 0,
            favoritesAdded: 0
          },
          favorites: response.data?.data?.favorites || [],
          recentActivity: response.data?.data?.recentActivity || []
        }, "gdfg")
        setDashboardData({
          preferences: response.data?.data?.preferences || {
            bodyStyle: [],
            engineType: [],
            fuelType: [],
            transmission: [],
            seatingCapacity: []
          },
          statistics: response.data?.data?.statistics || {
            carsViewed: 0,
            recommendationsGenerated: 0,
            favoritesAdded: 0
          },
          favorites: response.data?.data?.favorites || [],
          recentActivity: response.data?.data?.recentActivity || []
        });
        console.log(dashboardData, "dfsf")

      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || 'Failed to load dashboard');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userData');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);
  useEffect(() => {
    if (dashboardData) {
      sessionStorage.setItem('dashboardData', JSON.stringify(dashboardData));
    }
  }, [dashboardData]);
  // Chart data with fallback values
  const chartData = [
    { name: 'Cars Viewed', value: dashboardData.statistics?.carsViewed || 0 },
    { name: 'Recommendations', value: dashboardData.statistics?.recommendationsGenerated || 0 },
    { name: 'Favorites', value: dashboardData.statistics?.favoritesAdded || 0 },
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case 'recommendations':
        navigate('/recommendations');
        break;
      case 'preferences':
        navigate('/preferences');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        break;
    }
  };
  const [recentActivity, setRecentActivity] = useState([]);

  // useEffect(() => {
  //   const fetchRecentActivity = async () => {
  //     try {
  //       const response = await api.get('/api/activity/recent');
  //       setRecentActivity(response.data.data);
  //     } catch (error) {
  //       console.error('Error fetching activity:', error);
  //     }
  //   };

  //   fetchRecentActivity();
  // }, []);

  if (loading) return <div className="dashboard"><h1>Loading dashboard...</h1></div>;
  if (error) return <div className="dashboard"><h1>Error: {error}</h1></div>;

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1>Welcome, {userData?.name || 'User'}!</h1>

        <div className="dashboard-content">
          {/* User Profile Summary */}
          <div className="profile-summary">
            <h2>Your Profile</h2>
            <p><strong>Name:</strong> {userData?.name || 'Not available'}</p>
            <p><strong>Email:</strong> {userData?.email || 'Not available'}</p>
          </div>

          {/* Preferences Summary */}
          <div className="preferences-summary">
            <h2>Your Preferences</h2>
            <p><strong>Body Style:</strong> {dashboardData.preferences?.bodyStyle?.join(', ') || 'None set'}</p>
            <p><strong>Engine Type:</strong> {dashboardData.preferences?.engineType?.join(', ') || 'None set'}</p>
            <p><strong>Exhaust:</strong> {dashboardData.preferences?.exhaust?.join(', ') || 'None set'}</p>
            <p><strong>Tyres:</strong> {dashboardData.preferences?.tyres?.join(', ') || 'None set'}</p>
            <p><strong>Fuel Type:</strong> {dashboardData.preferences?.fuelType?.join(', ') || 'None set'}</p>
            <p><strong>Transmission:</strong> {dashboardData.preferences?.transmission?.join(', ') || 'None set'}</p>
            <p><strong>Seating Capacity:</strong> {dashboardData.preferences?.seatingCapacity?.join(', ') || 'None set'}</p>
          </div>

          {/* Rest of your dashboard components remain the same */}
          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <button
              className="action-btn"
              onClick={() => handleQuickAction('recommendations')}
            >
              View Recommendations
            </button>
            <button
              className="action-btn"
              onClick={() => handleQuickAction('preferences')}
            >
              Edit Preferences
            </button>
            <button
              className="action-btn"
              onClick={() => handleQuickAction('profile')}
            >
              Update Profile
            </button>
          </div>

          {/* Statistics Chart */}
          <div className="statistics">
            <h2>Statistics</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#f39c12" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Favorites Section */}
          <div className="favorites">
            <h2>Your Favorites</h2>
            <div className="favorites-grid">
              {dashboardData.favorites?.length > 0 ? (
                dashboardData.favorites
                  .slice(0, 2)
                  .map((car) => (
                    <div key={car.id} className="favorite-item">
                      <img src={car.imageUrl} alt={`${car.make} ${car.model}`} />
                      <p>{car.make} {car.model}</p>
                      <div className="favorite-actions">
                        <button
                          className="action-btn view-btn"
                          onClick={() => navigate(`/car/${car.id}`, {
                            state: {
                              car: car, // Pass the detailed car data
                            }
                          })}
                          aria-label="View car details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="action-btn remove-btn"
                          onClick={async () => {
                            try {
                              await api.removeFavorite(userData.id, car.id);
                              setDashboardData(prev => ({
                                ...prev,
                                favorites: prev.favorites.filter(f => f.id !== car.id),
                                statistics: {
                                  ...prev.statistics,
                                  favoritesAdded: prev.statistics.favoritesAdded - 1
                                }
                              }));
                              alert(
                                car.make + " " + car.model + " Successfully removed from Favorites"
                              )
                            } catch (error) {
                              console.error('Error removing favorite:', error);
                            }
                          }}
                          aria-label="Remove from favorites"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <p>No favorites saved yet</p>
              )}
            </div>

            {dashboardData.favorites?.length > 2 && (
              <button
                className="view-all-btn"
                onClick={() => navigate('/favorites')} // Or your favorites page route
              >
                View All Favorites ({dashboardData.favorites.length})
              </button>
            )}
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-feed">
              {dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity
                .slice(0, 5)
                .map(activity => (
                  <div key={activity.id} className={`activity-item ${activity.type}`}>
                    <div className="activity-icon">
                      {activity.type === 'car_view' && <CarIcon />}
                      {activity.type === 'preferences_update' && <SettingsIcon />}
                      {activity.type === 'favorite_add' && <HeartIcon />}
                      {activity.type === 'profile_update' && <ProfileIcon />}
                    </div>
                    <div className="activity-content">
                      <p className="activity-description">{activity.name}</p>
                      <p className="activity-date">{activity.date}</p>
                      {/* {activity.car && (
                        <div className="activity-car">
                          <img src={activity.car.image} alt={activity.car.name} />
                          <button onClick={() => navigate(`/cars/${activity.car.id}`)}>
                            View Car
                          </button>
                        </div>
                      )} */}
                    </div>
                  </div>
                ))
              ) : (
                <p>No recent activity</p>
              )}
            </div>
            {dashboardData.recentActivity?.length > 5 && (
              <button
                className="view-all-btn"
                onClick={() => navigate('/recentActivity')} // Or your favorites page route
              >
                View All Recent Activity ({dashboardData.recentActivity.length})
              </button>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;