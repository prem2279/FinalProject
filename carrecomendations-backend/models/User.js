const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
    // Removed select: false to make passwords visible (not recommended)
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  dashboard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dashboard'
  }
});

// Removed the password hashing pre-save hook
userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.constructor.createDashboardForUser(this._id)
      .then(dashboard => {
        this.dashboard = dashboard._id;
        next();
      })
      .catch(next);
  } else {
    next();
  }
});

// Removed the matchPassword method since we're not hashing
// In your User model, modify the matchPassword method:
userSchema.methods.matchPassword = async function(enteredPassword) {
  return enteredPassword === this.password; // Direct comparison
};


userSchema.statics.createDashboardForUser = async function(userId) {
  const Dashboard = mongoose.model('Dashboard');
  return await Dashboard.create({ userId });
};

module.exports = mongoose.model('User', userSchema);