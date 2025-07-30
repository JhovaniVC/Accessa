const AccessLog = require('../models/accessLog');

// Crear un nuevo registro de acceso
const createAccessLog = async (req, res) => {
  try {
    const { accessId, comments, userId } = req.body;

    const newAccessLog = new AccessLog({
      accessId,
      comments,
      userId
    });

    await newAccessLog.save();

    res.status(201).json({
      message: 'Access log created successfully',
      accessLog: newAccessLog
    });
  } catch (error) {
    console.error('Error creating access log:', error);
    res.status(500).json({ message: 'Error creating access log' });
  }
};

// Obtener los registros de acceso
const getAllAccessLogs = async (req, res) => {
  try {
    const accessLogs = await AccessLog.find().populate('userId', '-password').sort({ accessDate: -1 });
    res.status(200).json(accessLogs);
  } catch (error) {
    console.error('Error getting access logs:', error);
    res.status(500).json({ message: 'Error getting access logs' });
  }
};

// Obtener registros de acceso por ID de usuario
const getAccessLogsByUserId = async (req, res) => {
  try {
    const accessLogs = await AccessLog.find({ userId: req.params.userId })
      .populate('userId', '-password')
      .sort({ accessDate: -1 });
    
    res.status(200).json(accessLogs);
  } catch (error) {
    console.error('Error getting access logs by user ID:', error);
    res.status(500).json({ message: 'Error getting access logs by user ID' });
  }
};

// Obtener un registro de acceso por ID
const getAccessLogById = async (req, res) => {
  try {
    const accessLog = await AccessLog.findById(req.params.id).populate('userId', '-password');
    
    if (!accessLog) {
      return res.status(404).json({ message: 'Access log not found' });
    }
    
    res.status(200).json(accessLog);
  } catch (error) {
    console.error('Error getting access log:', error);
    res.status(500).json({ message: 'Error getting access log' });
  }
};

module.exports = {
  createAccessLog,
  getAllAccessLogs,
  getAccessLogsByUserId,
  getAccessLogById
};