const Activity = require('../models/Activity');
const Car = require('../models/Car');
const User = require('../models/User');

// Track any type of activity
exports.trackActivity = async (req, res) => {
  try {
    const { activityType, referenceId, description } = req.body;
    const userId = req.user.id;

    const activity = new Activity({
      userId,
      referenceId,
      activityType,
      description
    });

    await activity.save();

    res.status(201).json({
      success: true,
      data: activity
    });

  } catch (err) {
    console.error('Error tracking activity:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get all recent activity
exports.getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const activities = await Activity.find({ userId })
      .sort({ date: -1 })
      .limit(10)
      .populate({
        path: 'referenceId',
        select: 'make model imageUrl',  // For cars
        model: { $cond: [{ $eq: ['$activityType', 'car_view'] }, 'Car', null] }
      });

    // Format activities with appropriate icons and descriptions
    const formattedActivities = activities.map(activity => {
      const baseActivity = {
        id: activity._id,
        type: activity.activityType,
        date: activity.date.toLocaleString(),
        description: activity.description || this.getDefaultDescription(activity)
      };

      // Add car-specific data if relevant
      if (activity.activityType === 'car_view' && activity.referenceId) {
        baseActivity.car = {
          id: activity.referenceId._id,
          name: `${activity.referenceId.make} ${activity.referenceId.model}`,
          image: activity.referenceId.imageUrl
        };
      }

      return baseActivity;
    });

    res.status(200).json({
      success: true,
      data: formattedActivities
    });

  } catch (err) {
    console.error('Error getting recent activity:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Helper function for default descriptions
exports.getDefaultDescription = (activity) => {
  switch(activity.activityType) {
    case 'car_view':
      return 'Viewed a car';
    case 'preferences_update':
      return 'Updated preferences';
    case 'favorite_add':
      return 'Added to favorites';
    case 'profile_update':
      return 'Updated profile';
    default:
      return 'Performed an action';
  }
};