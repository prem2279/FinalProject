const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    statistics: {
      carsViewed: { type: Number, default: 0 },
      recommendationsGenerated: { type: Number, default: 0 },
      favoritesAdded: { type: Number, default: 0 }
    },
    preferences: {
      bodyStyle: { type: [String], default: [] },
    engineType: { type: [String], default: [] },
    exhaust: { type: [String], default: [] },
    tyres: { type: [String], default: [] },
    fuelType: { type: [String], default: [] },
    transmission: { type: [String], default: [] },
    seatingCapacity: { type: [Number], default: [] }
    },
    recentActivity: [{
      carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
      activityType: String,
      date: { type: Date, default: Date.now }
    }],
    favorites: [{
      carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
      addedAt: { type: Date, default: Date.now }
    }],
    carsViewed:[{
      carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
      addedAt: { type: Date, default: Date.now }
    }]
  }, { timestamps: true });

// Indexes for faster queries
dashboardSchema.index({ userId: 1 });
dashboardSchema.index({ 'recentActivity.date': -1 });
dashboardSchema.index({ 'favorites.addedAt': -1 });

module.exports = mongoose.model('Dashboard', dashboardSchema);