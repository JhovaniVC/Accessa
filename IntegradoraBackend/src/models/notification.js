const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  state: {
    type: Boolean,
    default: false // false = unread, true = read
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index for better query performance
notificationSchema.index({ userId: 1 });
notificationSchema.index({ state: 1 });
notificationSchema.index({ date: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
