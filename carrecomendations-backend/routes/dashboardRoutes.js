const express = require('express');
const {
  getDashboardData,
  updateStatistics,
  addRecentActivity
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth'); // Assuming you have auth middleware

const router = express.Router();

router.get('/', protect, getDashboardData);
router.patch('/stats', protect, updateStatistics);
router.post('/activity', protect, addRecentActivity);

module.exports = router;