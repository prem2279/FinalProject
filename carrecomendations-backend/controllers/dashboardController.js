const Dashboard = require('../models/Dashboard');
const User = require('../models/User');
const Car = require('../models/Car');
const { optimizeQuery } = require('../utils/atlasHelper');
const Activity = require('../models/Activity');
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with preferences
    const user = await User.findById(userId).select('preferences name email');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get dashboard data with populated favorites
    const dashboard = await Dashboard.findOne({ userId })
      .populate({
        path: 'favorites.carId',
        select: 'make model year bodyStyle engineType exhaust tyres fuelType transmission seatingCapacity imageUrl price'
      });

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        error: 'Dashboard not found'
      });
    }

    // Sort favorites by date (newest first) and take latest 2
    const sortedFavorites  = dashboard.favorites
    // // Take last 2 elements
    .reverse(); // Reverse to get newest first
    console.log(sortedFavorites,"fdd")
    // Get latest 5 recent activities from Activity model
    const recentActivities = await Activity.find({ userId })
      .sort({ date: -1 })
      //.limit(5)
      .populate({
        path: 'referenceId',
        select: 'make model imageUrl',
        model: 'Car'
      });

    // Count recommendations based on user preferences
    const recommendationsCount = await countRecommendations(user.preferences);

    // Update dashboard statistics with fresh count
    dashboard.statistics.recommendationsGenerated = recommendationsCount;
    await dashboard.save();

    // Format response
    const response = {
      user: {
        name: user.name,
        email: user.email
      },
      statistics: dashboard.statistics,
      preferences: user.preferences,
      recentActivity: recentActivities.map(activity => ({
        id: activity._id,
        type: activity.activityType,
        name: activity.referenceId 
          ? `${activity.referenceId.make || ''} ${activity.referenceId.model || ''}`.trim()
          : activity.description,
        image: activity.referenceId?.imageUrl || '',
        date: activity.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
      })),
      favorites: sortedFavorites.map(fav => {
        // Safely extract car data with fallbacks
        const car = fav.carId || {};
        const addedDate = fav.addedAt || new Date();
        
        return {
          id: car._id?.toString() || '', // Convert ObjectId to string
          make: car.make || 'Unknown',
          model: car.model || 'Car',
          year: car.year || 0,
          bodyStyle: car.bodyStyle || 'Not specified',
          engineType: car.engineType || 'Not specified',
          exhaust: car.exhaust || 'Not specified',
          tyres: car.tyres || 'Not specified',
          fuelType: car.fuelType || 'Not specified',
          transmission: car.transmission || 'Not specified',
          seatingCapacity: car.seatingCapacity || 0,
          price: car.price || 0,
          imageUrl: car.imageUrl || '',
          date: addedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        };
      }),
      chartData: [
        { name: 'Cars Viewed', value: dashboard.statistics.carsViewed || 0 },
        { name: 'Recommendations', value: recommendationsCount || 0 },
        { name: 'Favorites', value: dashboard.statistics.favoritesAdded || 0 }
      ]
    };

    res.json({
      success: true,
      data: response
    });

  } catch (err) {
    console.error('Error getting dashboard data:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
// Helper function to count recommendations based on preferences
async function countRecommendations(preferences) {
  try {
    const query = buildRecommendationQuery(preferences);
    const count = await Car.countDocuments(query);
    return count;
  } catch (err) {
    console.error('Error counting recommendations:', err);
    return 0; // Return 0 if there's an error
  }
}

// Helper function to build query from preferences
function buildRecommendationQuery(preferences) {
  const query = {};
  const mustHave = [];

  // Add filters for each preference category
  if (preferences.bodyStyle?.length) {
    mustHave.push({ bodyStyle: { $in: preferences.bodyStyle } });
  }
  if (preferences.engineType?.length) {
    mustHave.push({ engineType: { $in: preferences.engineType } });
  }
  if (preferences.fuelType?.length) {
    mustHave.push({ fuelType: { $in: preferences.fuelType } });
  }
  if (preferences.transmission?.length) {
    mustHave.push({ transmission: { $in: preferences.transmission } });
  }
  if (preferences.seatingCapacity?.length) {
    mustHave.push({ seatingCapacity: { $in: preferences.seatingCapacity } });
  }

  if (mustHave.length > 0) {
    query.$and = mustHave;
  }

  return query;
}


exports.updateStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { statType } = req.body;

    if (!['carsViewed', 'recommendationsGenerated', 'favoritesAdded'].includes(statType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid stat type'
      });
    }

    const updatedDashboard = await Dashboard.findOneAndUpdate(
      { userId },
      { $inc: { [`statistics.${statType}`]: 1 } },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedDashboard.statistics
    });
  } catch (err) {
    console.error('Error updating dashboard stats:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

exports.addRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { carId, activityType } = req.body;

    if (!['view', 'save', 'recommendation'].includes(activityType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid activity type'
      });
    }

    const updatedDashboard = await Dashboard.findOneAndUpdate(
      { userId },
      {
        $push: {
          recentActivity: {
            $each: [{ carId, activityType }],
            $slice: -10
          }
        }
      },
      { new: true }
    ).populate({
      path: 'recentActivity.carId',
      select: 'make model'
    });

    res.json({
      success: true,
      data: updatedDashboard.recentActivity
    });
  } catch (err) {
    console.error('Error adding recent activity:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Add this if missing
exports.updateDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const updatedDashboard = await Dashboard.findOneAndUpdate(
      { userId },
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedDashboard
    });
  } catch (err) {
    console.error('Error updating dashboard:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};