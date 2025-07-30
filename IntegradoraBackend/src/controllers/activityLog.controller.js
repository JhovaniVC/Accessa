const ActivityLog = require('../models/activityLog');
const User = require('../models/user');

// Crear un nuevo registro de actividad
const createActivityLog = async (req, res) => {
  try {
    const { userId, activityType, description, referenceId, referenceModel, metadata } = req.body;

    // Verificar si el usuario existe
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({ message: 'User not found' });
    }

    const newActivityLog = new ActivityLog({
      userId,
      activityType,
      description,
      referenceId,
      referenceModel,
      metadata,
      date: new Date()
    });

    await newActivityLog.save();

    res.status(201).json({
      message: 'Activity log created successfully',
      activityLog: newActivityLog
    });
  } catch (error) {
    console.error('Error creating activity log:', error);
    res.status(500).json({ message: 'Error creating activity log' });
  }
};

// Función interna para crear registros de actividad desde otros controladores
const logActivity = async (userId, activityType, description, referenceId = null, referenceModel = null, metadata = {}) => {
  try {
    const newActivityLog = new ActivityLog({
      userId,
      activityType,
      description,
      referenceId,
      referenceModel,
      metadata,
      date: new Date()
    });

    await newActivityLog.save();
    return newActivityLog;
  } catch (error) {
    console.error('Error logging activity:', error);
    return null;
  }
};

// Obtener todos los registros de actividad
const getAllActivityLogs = async (req, res) => {
  try {
    const activityLogs = await ActivityLog.find()
      .populate('userId', '-password')
      .sort({ date: -1 });
    
    res.status(200).json(activityLogs);
  } catch (error) {
    console.error('Error getting activity logs:', error);
    res.status(500).json({ message: 'Error getting activity logs' });
  }
};

// Obtener registros de actividad por ID de usuario
const getActivityLogsByUserId = async (req, res) => {
  try {
    const activityLogs = await ActivityLog.find({ userId: req.params.userId })
      .populate('userId', '-password')
      .sort({ date: -1 });
    
    res.status(200).json(activityLogs);
  } catch (error) {
    console.error('Error getting activity logs by user ID:', error);
    res.status(500).json({ message: 'Error getting activity logs by user ID' });
  }
};

// Obtener registros de actividad por tipo
const getActivityLogsByType = async (req, res) => {
  try {
    const { activityType } = req.params;
    
    const activityLogs = await ActivityLog.find({ activityType })
      .populate('userId', '-password')
      .sort({ date: -1 });
    
    res.status(200).json(activityLogs);
  } catch (error) {
    console.error('Error getting activity logs by type:', error);
    res.status(500).json({ message: 'Error getting activity logs by type' });
  }
};

// Obtener registros de actividad por usuario y tipo
const getActivityLogsByUserIdAndType = async (req, res) => {
  try {
    const { userId, activityType } = req.params;
    
    const activityLogs = await ActivityLog.find({ userId, activityType })
      .populate('userId', '-password')
      .sort({ date: -1 });
    
    res.status(200).json(activityLogs);
  } catch (error) {
    console.error('Error getting activity logs by user ID and type:', error);
    res.status(500).json({ message: 'Error getting activity logs by user ID and type' });
  }
};

module.exports = {
  createActivityLog,
  logActivity,
  getAllActivityLogs,
  getActivityLogsByUserId,
  getActivityLogsByType,
  getActivityLogsByUserIdAndType
};