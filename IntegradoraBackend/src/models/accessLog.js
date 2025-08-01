const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  // Información básica
  accessDate: {
    type: Date,
    default: Date.now
  },
  
  // Información del entregador
  deliveredBy: {
    type: String,
    required: true,
    trim: true
  },
  
  // Información de la paquetería
  courierCompany: {
    type: String,
    required: true,
    trim: true
  },
  
  // Información del departamento
  department: {
    type: String,
    required: true,
    trim: true
  },
  
  // Información del receptor
  receivedBy: {
    type: String,
    required: true,
    trim: true
  },
  
  // Descripción del paquete
  description: {
    type: String,
    trim: true
  },
  
  // Estado del paquete
  status: {
    type: String,
    enum: ['entregado', 'pendiente', 'rechazado'],
    default: 'entregado'
  },
  
  // Comentarios adicionales
  comments: {
    type: String,
    trim: true
  },
  
  // Usuario que registra (seguridad)
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better query performance
accessLogSchema.index({ registeredBy: 1 });
accessLogSchema.index({ accessDate: -1 });
accessLogSchema.index({ department: 1 });
accessLogSchema.index({ status: 1 });

module.exports = mongoose.model('AccessLog', accessLogSchema); 