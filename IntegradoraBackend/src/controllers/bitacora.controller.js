const Bitacora = require('../models/bitacora');
const { logActivity } = require('./activityLog.controller');

// Crear un nuevo registro de bitácora
const createBitacora = async (req, res) => {
  try {
    const { motivo, descripcion, informacionAdicional, contacto, tipo } = req.body;
    const userId = req.user._id;

    const newBitacora = new Bitacora({
      motivo,
      descripcion,
      informacionAdicional,
      contacto,
      userId,
      tipo: tipo || 'general',
      fechaHora: new Date()
    });

    await newBitacora.save();

    // Registrar la actividad
    await logActivity(
      userId,
      'BITACORA_CREATED',
      `Registro de bitácora creado: ${motivo}`,
      newBitacora._id,
      'Bitacora',
      { motivo, tipo: tipo || 'general' }
    );

    res.status(201).json({
      message: 'Registro de bitácora creado exitosamente',
      bitacora: newBitacora
    });
  } catch (error) {
    console.error('Error creating bitacora:', error);
    res.status(500).json({ message: 'Error al crear el registro de bitácora' });
  }
};

// Obtener todos los registros de bitácora
const getAllBitacoras = async (req, res) => {
  try {
    const bitacoras = await Bitacora.find()
      .populate('userId', 'fullName email')
      .sort({ fechaHora: -1 });
    
    res.status(200).json(bitacoras);
  } catch (error) {
    console.error('Error getting bitacoras:', error);
    res.status(500).json({ message: 'Error al obtener los registros de bitácora' });
  }
};

// Obtener registros de bitácora por tipo
const getBitacorasByType = async (req, res) => {
  try {
    const { tipo } = req.params;
    const bitacoras = await Bitacora.find({ tipo })
      .populate('userId', 'fullName email')
      .sort({ fechaHora: -1 });
    
    res.status(200).json(bitacoras);
  } catch (error) {
    console.error('Error getting bitacoras by type:', error);
    res.status(500).json({ message: 'Error al obtener los registros de bitácora por tipo' });
  }
};

// Obtener registros de bitácora por usuario
const getBitacorasByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const bitacoras = await Bitacora.find({ userId })
      .populate('userId', 'fullName email')
      .sort({ fechaHora: -1 });
    
    res.status(200).json(bitacoras);
  } catch (error) {
    console.error('Error getting bitacoras by user ID:', error);
    res.status(500).json({ message: 'Error al obtener los registros de bitácora del usuario' });
  }
};

// Obtener un registro de bitácora por ID
const getBitacoraById = async (req, res) => {
  try {
    const bitacora = await Bitacora.findById(req.params.id)
      .populate('userId', 'fullName email');
    
    if (!bitacora) {
      return res.status(404).json({ message: 'Registro de bitácora no encontrado' });
    }
    
    res.status(200).json(bitacora);
  } catch (error) {
    console.error('Error getting bitacora by ID:', error);
    res.status(500).json({ message: 'Error al obtener el registro de bitácora' });
  }
};

// Actualizar un registro de bitácora
const updateBitacora = async (req, res) => {
  try {
    const { motivo, descripcion, informacionAdicional, contacto, tipo } = req.body;
    
    const bitacora = await Bitacora.findById(req.params.id);
    
    if (!bitacora) {
      return res.status(404).json({ message: 'Registro de bitácora no encontrado' });
    }
    
    // Solo el creador puede actualizar su registro
    if (bitacora.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permisos para actualizar este registro' });
    }
    
    const updatedBitacora = await Bitacora.findByIdAndUpdate(
      req.params.id,
      {
        motivo,
        descripcion,
        informacionAdicional,
        contacto,
        tipo
      },
      { new: true }
    ).populate('userId', 'fullName email');
    
    // Registrar la actividad
    await logActivity(
      req.user._id,
      'BITACORA_UPDATED',
      `Registro de bitácora actualizado: ${motivo}`,
      updatedBitacora._id,
      'Bitacora',
      { motivo, tipo }
    );
    
    res.status(200).json({
      message: 'Registro de bitácora actualizado exitosamente',
      bitacora: updatedBitacora
    });
  } catch (error) {
    console.error('Error updating bitacora:', error);
    res.status(500).json({ message: 'Error al actualizar el registro de bitácora' });
  }
};

// Eliminar un registro de bitácora
const deleteBitacora = async (req, res) => {
  try {
    const bitacora = await Bitacora.findById(req.params.id);
    
    if (!bitacora) {
      return res.status(404).json({ message: 'Registro de bitácora no encontrado' });
    }
    
    // Solo el creador puede eliminar su registro
    if (bitacora.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este registro' });
    }
    
    await Bitacora.findByIdAndDelete(req.params.id);
    
    // Registrar la actividad
    await logActivity(
      req.user._id,
      'BITACORA_DELETED',
      `Registro de bitácora eliminado: ${bitacora.motivo}`,
      bitacora._id,
      'Bitacora',
      { motivo: bitacora.motivo }
    );
    
    res.status(200).json({ message: 'Registro de bitácora eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting bitacora:', error);
    res.status(500).json({ message: 'Error al eliminar el registro de bitácora' });
  }
};

module.exports = {
  createBitacora,
  getAllBitacoras,
  getBitacorasByType,
  getBitacorasByUserId,
  getBitacoraById,
  updateBitacora,
  deleteBitacora
}; 