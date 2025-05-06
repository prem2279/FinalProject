// Add to login function

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select('+password')
      .populate({
        path: 'dashboard',
        populate: {
          path: 'favorites.carId recentActivity.carId',
          select: 'make model year bodyStyle engineType exhaust tyres fuelType transmission seatingCapacity imageUrl price'
        }
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences // Ensure preferences are included
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};


  const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Dashboard = require('../models/Dashboard');
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
// controllers/authController.js
exports.register = async (req, res) => {
  try {
    const { name, email, password, preferences } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create user first to get the _id
    const user = new User({
      name,
      email,
      password,
      preferences: {
        bodyStyle: preferences.bodyStyle || [],
        engineType: preferences.engineType || [],
        exhaust: preferences.exhaust || [],
        tyres: preferences.tyres || [],
        fuelType: preferences.fuelType || [],
        transmission: preferences.transmission || [],
        seatingCapacity: preferences.seatingCapacity|| []
      }
    });

    // Create dashboard with the user's _id
    const dashboard = new Dashboard({
      userId: user._id,
      statistics: {
        carsViewed: 0,
        recommendationsGenerated: 0,
        favoritesAdded: 0
      },
      preferences: user.preferences,
      favorites: [],
      recentActivity: []
    });

    // Save both in a transaction
    const session = await User.startSession();
    session.startTransaction();

    try {
      await user.save({ session });
      await dashboard.save({ session });
      user.dashboard = dashboard._id;
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferences: user.preferences
        }
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = {};
      
      // Extract all validation errors
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
  
      return res.status(400).json({
        success: false,
        error: 'Please Enter Valid Email',
        validationErrors: errors
      });
    }
  
    // Handle other types of errors
    res.status(500).json({
      success: false,
      error: 'Server error occurred'
    });
  }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};


// controllers/authController.js

// @desc    Verify token
// @route   GET /auth/verify
// @access  Private
exports.verifyToken = async (req, res) => {
  try {
    // The protect middleware already verified the token
    // Just return the user data
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};