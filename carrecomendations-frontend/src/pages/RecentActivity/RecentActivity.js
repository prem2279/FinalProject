import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaCar as CarIcon,
    FaCog as SettingsIcon,
    FaHeart as HeartIcon,
    FaUser as ProfileIcon
} from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import './RecentActivity.css';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const RecentActivity = () => {
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const fetchRecentActivity = async () => {
            try {
                const dashboardData = JSON.parse(sessionStorage.getItem('dashboardData'));
                setRecentActivity(dashboardData.recentActivity);
            } catch (err) {
                console.error('Error fetching recent activity:', err);
                setError('Failed to load recent activity');

            } finally {
                setLoading(false);
            }
        };

        fetchRecentActivity();
    }, [isLoggedIn]);

    if (loading) return <div className="recent-activity"><p>Loading activity...</p></div>;
    if (error) return <div className="recent-activity"><p>{error}</p></div>;

    return (
        <div className="dashboard-container">
          <div className="recent-activity-content">
            <h1>Recent Activity</h1>
            
            <div className="activity-feed">
              {recentActivity.length > 0 ? (
                recentActivity.map(activity => (
                  <div key={activity.id} className={`activity-item ${activity.type}`}>
                    <div className="activity-icon">
                      {activity.type === 'car_view' && <CarIcon />}
                      {activity.type === 'preferences_update' && <SettingsIcon />}
                      {activity.type === 'favorite_add' && <HeartIcon />}
                      {activity.type === 'profile_update' && <ProfileIcon />}
                    </div>
                    <div className="activity-details">
                      <p className="activity-description">{activity.name}</p>
                      <p className="activity-date">{activity.date}</p>
                      
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-activities">No recent activity found</p>
              )}
            </div>
    
            <button 
              onClick={() => navigate('/dashboard')} 
              className="dashboard-return-btn"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
};

export default RecentActivity;