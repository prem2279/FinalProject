
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './PreferenceForm.css';
import { useAuth } from '../../context/AuthContext';

const PreferenceForm = ({ 
  preferences, 
  setPreferences, 
  onSubmit,
  scrollToTop,
  availableOptions = {}, 
  isSignupPage = false,
  wrapOptions = true, // New prop with default value
  
}) => {
  // Simple icon-style images that match option names exactly
  
 const { isLoggedIn } = useAuth();
 const [error, setError] = useState('');
  

  const handleSelection = (category, value) => {
    const currentSelection = preferences[category] || [];
    if (currentSelection.includes(value)) {
      setPreferences({
        ...preferences,
        [category]: currentSelection.filter((item) => item !== value),
      });
    } else {
      setPreferences({
        ...preferences,
        [category]: [...currentSelection, value],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if at least one preference is selected in any category
    const hasSelections = Object.values(preferences).some(
      categorySelections => categorySelections && categorySelections.length > 0
    );

    if (!hasSelections) {
      setError('Please select at least one preference in any category');
      scrollToTop();
      return;
    }

    setError(''); // Clear any previous errors
    onSubmit(e); // Proceed with submission
  };

  const formatLabel = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/([A-Z])/g, ' $1').trim();
  };

  const formatOptionName = (value) => {
    const str = String(value || '');
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <form className="preference-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      {Object.entries(availableOptions).map(([category, options]) => (
        <div key={category} className="preference-category">
          <label>{formatLabel(category)}</label>
          <div 
            className="option-group"
            style={{ flexWrap: wrapOptions ? 'wrap' : 'nowrap' }}
          >
            {options.map(option => (
              <div
                key={option}
                className={`option ${preferences[category]?.includes(option) ? 'selected' : ''}`}
                onClick={() => handleSelection(category, option)}
              >
                <img 
                  src={require(`../../../images/${option}.png`)} 
                  alt={formatOptionName(option)}
                  
                />
                {/* <img src='https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?cs=srgb&dl=pexels-mikebirdy-1335077.jpg&fm=jpg'></img> */}
                {/* <img src='https://livealbany-my.sharepoint.com/:i:/r/personal/hbojjam_albany_edu/Documents/project/coupe.png?download=1'></img> */}
                <p>{formatOptionName(option)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {!isSignupPage && !isLoggedIn && (
        <button type="submit" className="recommendation-button">
          Show Recommendations
        </button>
      )}
      {isLoggedIn && (
        <button type="submit" className="recommendation-button">
          Update Preferences
        </button>
      )}
    </form>
  );
};

PreferenceForm.propTypes = {
  preferences: PropTypes.object.isRequired,
  setPreferences: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  availableOptions: PropTypes.object,
  isSignupPage: PropTypes.bool
};

PreferenceForm.defaultProps = {
  availableOptions: {},
  isSignupPage: false
};

export default PreferenceForm;