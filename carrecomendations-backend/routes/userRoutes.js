// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.put('/preferences', userController.updatePreferences);
router.post('/addToFavorites',userController.addToFavorites);
router.post('/getCarDetails',userController.getCarDetails);
router.post('/updateUserProfile',userController.updateUserProfile)
router.post('/removeFavorite',userController.removeFavorite);
module.exports = router;