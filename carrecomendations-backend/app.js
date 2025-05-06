require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const recommendationRoutes = require('./routes/recommendationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes')
const { protect } = require('./middleware/auth');
const path = require('path');
// Add to the top of your app.js
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  // Implement your Atlas-specific error recovery here
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  // Implement your Atlas-specific error recovery here
});

// Import routes
const preferencesRoutes = require('./routes/preferencesRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/', preferencesRoutes);
app.use('/api/', recommendationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/',userRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Catch-all route to serve React's index.html for unknown routes
app.use(express.static(path.join(__dirname, '../carrecomendations-frontend/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../carrecomendations-frontend/build', 'index.html'));
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});