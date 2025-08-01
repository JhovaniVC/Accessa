const mongoose = require('mongoose');

const bitacoraSchema = new mongoose.Schema({
  motivo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  informacionAdicional: {
    type: String,
    required: false,
    trim: true
  },
  contacto: {
    type: String,
    required: false,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fechaHora: {
    type: Date,
    default: Date.now
  },
  tipo: {
    type: String,
    enum: ['general', 'accesos', 'personal'],
    default: 'general'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index for better query performance
bitacoraSchema.index({ userId: 1 });
bitacoraSchema.index({ fechaHora: -1 });
bitacoraSchema.index({ tipo: 1 });

module.exports = mongoose.model('Bitacora', bitacoraSchema); 