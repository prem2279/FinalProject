import React from 'react';
import PropTypes from 'prop-types';
import './CarCard.css';

const CarCard = ({ car, onViewDetails }) => {
  return (
    <div className="car-card">
      <img src={car.imageUrl} alt={`${car.make} ${car.model}`} />
      <div className="car-card-info">
        <h3>{car.make} {car.model}</h3>
        {/* <p>{car.year} • {car.bodyStyle}</p>
        <p>${car.price?.toLocaleString()}</p> */}
      </div>
      <button onClick={onViewDetails}>View Details</button>
    </div>
  );
};

CarCard.propTypes = {
  car: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    make: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    bodyStyle: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired
};

export default CarCard;