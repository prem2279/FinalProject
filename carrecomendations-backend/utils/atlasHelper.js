const mongoose = require('mongoose');

// Optimize queries for Atlas
exports.optimizeQuery = (query) => {
    return query
    .maxTimeMS(10000) // Set query timeout first
    .lean() // Convert to plain JS objects
    .read('secondaryPreferred'); // Correct read preference method
};

// Handle Atlas connection issues
exports.handleConnectionError = (err) => {
  if (err.name === 'MongoNetworkError') {
    console.error('Network error connecting to Atlas:', err);
    // Implement retry logic here if needed
  }
  throw err;
};