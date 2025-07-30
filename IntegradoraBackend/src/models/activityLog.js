const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    enum: ['QR_CREATED', 'QR_USED', 'QR_ACREDITATED', 'REPORT_CREATED', 'REPORT_READ', 'PANIC_ALERT_SENT', 'NOTIFICATION_READ'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceModel',
    required: false
  },
  referenceModel: {
    type: String,
    enum: ['QRCode', 'ReportLog', 'Notification', 'AccessLog'],
    required: false
  },
  metadata: {
    type: Object,
    default: {}
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index for better query performance
activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ activityType: 1 });
activityLogSchema.index({ date: -1 });
activityLogSchema.index({ referenceId: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);