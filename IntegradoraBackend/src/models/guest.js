const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  guestId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  qrId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRCode',
    required: true
  },
  invitationDate: {
    type: Date,
    default: Date.now
  },
  useDate: {
    type: Date,
    default: null
  },
  accessAllowed: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index for better query performance
guestSchema.index({ qrId: 1 });
guestSchema.index({ invitationDate: -1 });

module.exports = mongoose.model('Guest', guestSchema);
