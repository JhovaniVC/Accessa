const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  information: {
    type: String,
    required: true,
    trim: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  qrImage: {
    type: String,
    required: false,
    trim: true
  },
  acreditationDate: {
    type: Date,
    default: null
  },
  useDate: {
    type: Date,
    default: null
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
qrCodeSchema.index({ userId: 1 });
qrCodeSchema.index({ expirationDate: 1 });

module.exports = mongoose.model('QRCode', qrCodeSchema); 