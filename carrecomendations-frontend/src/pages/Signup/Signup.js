import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import PreferenceForm from '../../components/PreferenceForm/PreferenceForm';
import './Signup.css';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
const Signup = ({ scrollToTop }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [preferences, setPreferences] = useState(() => {
    const savedPreferences = sessionStorage.getItem('preferences');
    return savedPreferences ? JSON.parse(savedPreferences) : {
      bodyStyle: [],
      engineType: [],
      exhaust: [],
      tyres: [],
      fuelType: [],
      transmission: [],
      seatingCapacity: [],
    };
  });

  const [availableOptions, setAvailableOptions] = useState({});
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  // Form validation
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const response = await api.getPreferences();
        setAvailableOptions(response.data.data || {});
      } catch (error) {
        console.error('Error fetching options:', error);
        setAvailableOptions({});
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
    };

    // Name validation
    if (!userData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    // Email validation
    if (!userData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    // Password validation
    if (!userData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (userData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      console.log("jh")
      const response = await api.register({
        ...userData,
        preferences
      });
      console.log(response.data,"gg")
      // Axios puts the response data in response.data
      if (response.status >= 200 && response.status < 300) {
        // Success case
        login(response.data.token);
        //sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('userData', JSON.stringify(response.data.data));
        sessionStorage.removeItem('preferences');
        navigate('/dashboard');
      } else {
        // Error case
        console.log(response.data,"g")
        scrollToTop();
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (err) {
      scrollToTop();
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="signup" >
      <div className="signup-container" >
        <h1>Sign Up</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* User Details Section */}
          <h2>User Details</h2>
          <label>
            Name:
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              required
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>
            Email:
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>
            Password:
            <input
              type="password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              minLength="6"
              required
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>

          {/* Car Preferences Section */}
          <h2>Car Preferences</h2>
          {loadingOptions ? (
            <div className="loading-options">
              Loading preference options...
            </div>
          ) : (
            <PreferenceForm
              preferences={preferences}
              setPreferences={setPreferences}
              availableOptions={availableOptions}
              isSignupPage={true}
            />
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading || loadingOptions}
            className={loading ? 'loading' : ''}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;