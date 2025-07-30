const mongoose = require('mongoose');

const reportLogSchema = new mongoose.Schema({
  problemType: {
    type: String,
    required: true,
    trim: true
  },
  problemLocation: {
    type: String,
    required: true,
    trim: true
  },
  evidence: {
    type: String,
    required: false, // Ahora es opcional
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  reportType: {
    type: String,
    enum: ['resident', 'guard'],
    default: 'resident'
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
reportLogSchema.index({ userId: 1 });
reportLogSchema.index({ problemType: 1 });
reportLogSchema.index({ reportType: 1 });
reportLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ReportLog', reportLogSchema);