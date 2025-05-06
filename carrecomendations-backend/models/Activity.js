const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referenceId: {  // Can be carId, preferenceId, etc.
    type: mongoose.Schema.Types.ObjectId
  },
  activityType: {
    type: String,
    enum: ['car_view', 'preferences_update', 'favorite_add', 'profile_update'],
    required: true
  },
  description: String,  // Human-readable description
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);