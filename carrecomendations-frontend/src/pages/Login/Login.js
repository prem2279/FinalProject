import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Login.css';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.login(formData);
      const { token, data } = response.data;

      if (!token) {
        throw new Error('Authentication failed');
      }
      login(token);
      //sessionStorage.setItem('token', token);
      sessionStorage.setItem('userData', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login">
      <div className="login-container">
        <h1>Login</h1>
        {error && (
          <div className="error-message">
            {error}
            {/* {error.includes('credentials') && (
              <p className="error-help">
                Forgot password? <Link to="/forgot-password">Reset it here</Link>
              </p>
            )} */}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="username"
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="current-password"
              minLength="6"
            />
          </label>
          <button 
            type="submit" 
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
          {/* <p>
            <Link to="/forgot-password">Forgot password?</Link>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;