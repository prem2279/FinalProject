const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
    index: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  bodyStyle: {
    type: String,
    enum: ['sedan', 'suv', 'coupe', 'hatchback', 'convertible', 'truck', 'minivan'], // ⚡ Added 'minivan'
    required: true,
    index: true
  },
  engineType: {
    type: String,
    enum: ['I4', 'V6', 'V8', 'electric', 'hybrid', 'inline-6', '4 cylinder', '6 cylinder', '8 cylinder'], // ⚡ Added cylinder variants
    required: true
  },
  exhaust: {
    type: String,
    enum: ['single', 'dual', 'none'],
    default: 'single'
  },
  tyres: {
    type: String,
    enum: ['all-terrain', 'performance', 'standard', 'winter', 'eco', 'run-flat', 'all-season'], // ⚡ Added 'all-season'
    default: 'standard'
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    required: true,
    index: true
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic', 'CVT', 'DCT'],
    required: true
  },
  seatingCapacity: {
    type: Number,
    enum: [2, 4, 5, 7, 8],
    required: true
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  features: [String],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  }
}, {
  timestamps: true
});

// Indexes for performance on filtering
carSchema.index({ bodyStyle: 1, fuelType: 1, seatingCapacity: 1 });
carSchema.index({ fuelType: 1, seatingCapacity: 1 });
carSchema.index({ bodyStyle: 1, price: 1 });

module.exports = mongoose.model('Car', carSchema);
