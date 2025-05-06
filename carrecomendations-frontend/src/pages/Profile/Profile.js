import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './Profile.css';
import api from '../../services/api';
const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    preferences: {
      bodyStyle: '',
      engineType: '',
      exhaust: '',
      tyres: '',
      fuelType: '',
      transmission: '',
      seatingCapacity: '',
    },
  });

  useEffect(() => {
    // Get user data from sessionStorage when component mounts
    const loadUserData = () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const dashboardData = JSON.parse(sessionStorage.getItem('dashboardData'));

        if (userData) {
          setUser({
            name: userData.name || '',
            email: userData.email || '',
            preferences: {
              bodyStyle: dashboardData.preferences?.bodyStyle?.join(', ') || 'None set',
              engineType: dashboardData.preferences?.engineType?.join(', ') || 'None set',
              exhaust: dashboardData.preferences?.exhaust?.join(', ') || 'None set',
              tyres: dashboardData.preferences?.tyres?.join(', ') || 'None set',
              fuelType: dashboardData.preferences?.fuelType?.join(', ') || 'None set',
              transmission: dashboardData.preferences?.transmission?.join(', ') || 'None set',
              seatingCapacity: dashboardData.preferences?.seatingCapacity?.join(', ') || 'None set',
            }
          });
        }
      } catch (error) {
        console.error('Error parsing user data from sessionStorage:', error);
      }
    };

    loadUserData();
  }, []); // Empty dependency array means this runs once on mount

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // Get user data from sessionStorage
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      
      if (userData) {
        // Prepare the update data object
        const updateData = {
          userId: userData.id,  // or userData._id depending on your backend
          name: user.name,
          email: user.email,
          preferences: user.preferences
        };
  
        // Update sessionStorage
        const updatedUserData = {
          ...userData,
          name: user.name,
          email: user.email,
          preferences: user.preferences
        };
        sessionStorage.setItem('userData', JSON.stringify(updatedUserData));
  
        // Send to backend
        const response = await api.updateUserProfile(updateData);
        
        console.log('Profile updated successfully:', response.data);
        alert('Profile updated successfully');
        // You might want to show a success message to the user here
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="profile">
      <Navbar />
      <h1>Your Profile</h1>
      <form className="profile-form" onSubmit={handleUpdate}>
        <label>
          Name:
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </label>
        <h2>Preferences</h2>
        <div className="preferences">
          <p><strong>Body Style:</strong> {user.preferences.bodyStyle}</p>
          <p><strong>Engine Type:</strong> {user.preferences.engineType}</p>
          <p><strong>Exhaust:</strong> {user.preferences.exhaust}</p>
          <p><strong>Tyres:</strong> {user.preferences.tyres}</p>
          <p><strong>Fuel Type:</strong> {user.preferences.fuelType}</p>
          <p><strong>Transmission:</strong> {user.preferences.transmission}</p>
          <p><strong>Seating Capacity:</strong> {user.preferences.seatingCapacity}</p>
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;