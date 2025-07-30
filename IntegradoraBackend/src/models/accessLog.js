const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  accessId: {
    type: String,
    required: true,
    trim: true
  },
  accessDate: {
    type: Date,
    default: Date.now
  },
  comments: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index for better query performance
accessLogSchema.index({ userId: 1 });
accessLogSchema.index({ accessId: 1 });
accessLogSchema.index({ accessDate: -1 });

module.exports = mongoose.model('AccessLog', accessLogSchema); 