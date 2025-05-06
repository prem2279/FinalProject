// controllers/userController.js
const User = require('../models/User');
const Car = require('../models/Car');
const Dashboard = require('../models/Dashboard');
const Activity = require('../models/Activity');
exports.updatePreferences = async (req, res) => {
    try {
        console.log(req.body, "fdfd");
        const { userId, preferences } = req.body; // Get from body instead of req.user

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { preferences },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        try {
            await Activity.create({
                userId: userId,
                activityType: 'preferences_update',
                description: 'Updated preferences'
            });
        } catch (error) {
            console.error('Error in update preferences activity:', error);
        }

        let dashboard = await Dashboard.findOne({ userId });

        if (!dashboard) {
            dashboard = new Dashboard({
                userId,
                favorites: [],
                recentActivity: [],
                statistics: {
                    carsViewed: 0,
                    recommendationsGenerated: 0,
                    favoritesAdded: 0
                }
            });
        }
        dashboard.statistics.carsViewed = 0;
        await dashboard.save();

        res.status(200).json({
            success: true,
            data: user.preferences
        });
    } catch (err) {
        console.error('Update preferences error:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};


// Add to favorites controller
exports.addToFavorites = async (req, res) => {
    try {
        const { userId, carId } = req.body;

        // Validate input
        if (!carId) {
            return res.status(400).json({
                success: false,
                error: 'Car ID is required'
            });
        }

        // Check if car exists
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({
                success: false,
                error: 'Car not found'
            });
        }

        // Find or create dashboard for user
        let dashboard = await Dashboard.findOne({ userId });

        if (!dashboard) {
            dashboard = new Dashboard({
                userId,
                favorites: [],
                recentActivity: [],
                statistics: {
                    carsViewed: 0,
                    recommendationsGenerated: 0,
                    favoritesAdded: 0
                }
            });
        }

        // Check if already in favorites
        const alreadyFavorite = dashboard.favorites.some(fav =>
            fav.carId.toString() === carId
        );

        if (alreadyFavorite) {
            return res.status(400).json({
                success: false,
                error: 'Car already in favorites'
            });
        }

        // Add to favorites
        dashboard.favorites.push({ carId });
        dashboard.statistics.favoritesAdded += 1;

        // Save the updated dashboard
        await dashboard.save();

        // Populate the car details for response (updated for Mongoose v6+)
        const populatedDashboard = await Dashboard.findById(dashboard._id)
            .populate({
                path: 'favorites.carId',
                select: 'make model year imageUrl price'
            });

        // Find the newly added favorite
        const addedFavorite = populatedDashboard.favorites.find(fav =>
            fav.carId._id.toString() === carId
        );

        try {
            await Activity.create({
                userId: userId,
                activityType: 'favorite_add',
                description: car.make + ' ' + car.model + ' added to favorites'
            });
        } catch (error) {
            console.error('Error adding to favorites activity:', error);
        }


        res.status(201).json({
            success: true,
            data: {
                id: addedFavorite.carId._id,
                make: addedFavorite.carId.make,
                model: addedFavorite.carId.model,
                year: addedFavorite.carId.year,
                imageUrl: addedFavorite.carId.imageUrl,
                price: addedFavorite.carId.price,
                addedAt: addedFavorite.addedAt
            }
        });



    } catch (err) {
        console.error('Error adding to favorites:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Remove from favorites controller
exports.removeFavorite = async (req, res) => {
    try {
        const { userId, carId } = req.body;

        // Validate input
        if (!carId) {
            return res.status(400).json({
                success: false,
                error: 'Car ID is required'
            });
        }
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({
                success: false,
                error: 'Car not found'
            });
        }
        // Update dashboard
        const dashboard = await Dashboard.findOneAndUpdate(
            { userId },
            {
                $pull: { favorites: { carId } },
                $inc: { 'statistics.favoritesAdded': -1 }
            },
            { new: true }
        );

        if (!dashboard) {
            return res.status(404).json({
                success: false,
                error: 'Dashboard not found'
            });
        }

        try {
            await Activity.create({
                userId: userId,
                activityType: 'favorite_add',
                description: car.make + ' ' + car.model + ' removed from favorites'
            });
        } catch (error) {
            console.error('Error removing favorites activity:', error);
        }

        res.json({
            success: true,
            data: {
                message: 'Car removed from favorites',
                remainingFavorites: dashboard.favorites.length
            }
        });

    } catch (err) {
        console.error('Error removing from favorites:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Get favorites controller
exports.getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;

        const dashboard = await Dashboard.findOne({ userId })
            .populate({
                path: 'favorites.carId',
                select: 'make model year imageUrl price mileage fuelType transmission'
            });

        if (!dashboard) {
            return res.status(404).json({
                success: false,
                error: 'Dashboard not found'
            });
        }

        // Format response
        const favorites = dashboard.favorites.map(fav => ({
            id: fav.carId._id,
            make: fav.carId.make,
            model: fav.carId.model,
            year: fav.carId.year,
            imageUrl: fav.carId.imageUrl,
            price: fav.carId.price,
            mileage: fav.carId.mileage,
            fuelType: fav.carId.fuelType,
            transmission: fav.carId.transmission,
            addedAt: fav.addedAt
        }));

        res.json({
            success: true,
            data: favorites
        });

    } catch (err) {
        console.error('Error getting favorites:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

exports.getCarDetails = async (req, res) => {
    try {

        const { userId, carId } = req.body;

        if (!carId) {
            return res.status(400).json({
                success: false,
                error: 'Car ID is required'
            });
        }

        // Check if car exists
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({
                success: false,
                error: 'Car not found'
            });
        }

        // Find or create dashboard for user
        let dashboard = await Dashboard.findOne({ userId });

        if (!dashboard) {
            dashboard = new Dashboard({
                userId,
                favorites: [],
                recentActivity: [],
                statistics: {
                    carsViewed: 0,
                    recommendationsGenerated: 0,
                    favoritesAdded: 0
                }
            });
        }


        await Activity.create({
            userId: userId,
            activityType: 'car_view',
            description: 'Browsed ' + car.make + ' ' + car.model + ' details'
        });

        dashboard.statistics.carsViewed += 1;
        await dashboard.save();
        res.status(201).json({
            success: true,

        });

    } catch (error) {
        console.error('Error adding to Car details to Recent Activity:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};


exports.updateUserProfile = async (req, res) => {
    try {
        console.log(req.body, "fdfd");
        const { userId, name, email, preferences } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        try {
            await Activity.create({
                userId: userId,
                activityType: 'profile_update',
                description: 'Updated profile'
            });
        } catch (error) {
            console.error('Error in update profile activity:', error);
        }
        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (err) {
        console.error('Update Profile error:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};