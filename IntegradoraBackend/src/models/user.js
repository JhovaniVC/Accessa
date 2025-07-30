const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  paternalSurname: {
    type: String,
    required: true,
    trim: true
  },
  maternalSurname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  housingUnit: {
    type: String,
    required: false,
    trim: true
  },
  turn: {
    type: String,
    required: false,
    trim: true
  },
  state: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.name} ${this.paternalSurname} ${this.maternalSurname}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
