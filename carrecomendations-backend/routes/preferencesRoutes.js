const express = require('express');
const {
  getPreferenceOptions,
} = require('../controllers/preferencesController');

const router = express.Router();

router.get('/preferences', getPreferenceOptions);

module.exports = router;