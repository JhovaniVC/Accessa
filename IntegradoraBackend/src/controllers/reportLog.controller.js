const ReportLog = require('../models/reportLog');
const User = require('../models/user');
const Notification = require('../models/notification');
const path = require('path');

// Crear un nuevo reporte (para residentes)
const createReport = async (req, res) => {
  try {
    // Soportar tanto multipart/form-data como JSON
    let problemType, problemLocation, description, userId;
    if (req.body.type) {
      // Viene de multipart/form-data (app móvil)
      problemType = req.body.type;
      problemLocation = req.body.location;
      description = req.body.description;
      userId = req.body.userId || (req.user && req.user._id);
    } else {
      // Viene de JSON (web o sin imagen)
      problemType = req.body.problemType || req.body.type;
      problemLocation = req.body.problemLocation || req.body.location;
      description = req.body.description;
      userId = req.body.userId || (req.user && req.user._id);
    }

    // Manejar la imagen si existe
    let evidence = null;
    if (req.file) {
      // Guardar la ruta relativa de la imagen
      evidence = path.join('uploads', req.file.filename);
    }

    const newReport = new ReportLog({
      problemType,
      problemLocation,
      evidence,
      description,
      userId,
      reportType: 'resident' // Indicar que es un reporte de residente
    });

    await newReport.save();

    // Notificar a los guardias sobre el nuevo reporte
    const guards = await User.find({ 'roleId.name': 'guard', state: true });
    
    if (guards.length > 0) {
      const notificationPromises = guards.map(guard => {
        const notification = new Notification({
          userId: guard._id,
          type: 'NEW_REPORT',
          message: `${req.user.name} ${req.user.paternalSurname} ha creado un nuevo reporte sobre ${problemType} en ${problemLocation}`
        });
        return notification.save();
      });
      await Promise.all(notificationPromises);
    }

    res.status(201).json({
      message: 'Report created successfully',
      report: newReport
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Error creating report' });
  }
};

// Crear un reporte administrativo (para guardias)
const createAdminReport = async (req, res) => {
  try {
    const { problemType, problemLocation, evidence, description } = req.body;
    const userId = req.user._id; // Usuario que crea el reporte (obtenido del token)

    const newReport = new ReportLog({
      problemType,
      problemLocation,
      evidence,
      description,
      userId,
      reportType: 'guard' // Indicar que es un reporte de guardia
    });

    await newReport.save();

    // Notificar a los administradores sobre el nuevo reporte
    const admins = await User.find({ 'roleId.name': 'admin', state: true });
    
    if (admins.length > 0) {
      const notificationPromises = admins.map(admin => {
        const notification = new Notification({
          userId: admin._id,
          type: 'ADMIN_REPORT',
          message: `El guardia ${req.user.name} ${req.user.paternalSurname} ha creado un reporte administrativo sobre ${problemType} en ${problemLocation}`
        });
        return notification.save();
      });
      
      await Promise.all(notificationPromises);
    }

    res.status(201).json({
      message: 'Administrative report created successfully',
      report: newReport
    });
  } catch (error) {
    console.error('Error creating administrative report:', error);
    res.status(500).json({ message: 'Error creating administrative report' });
  }
};

// Obtener todos los reportes
const getAllReports = async (req, res) => {
  try {
    const reports = await ReportLog.find().populate('userId', '-password').sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error getting reports:', error);
    res.status(500).json({ message: 'Error getting reports' });
  }
};

// Obtener reportes por tipo (residente o guardia)
const getReportsByType = async (req, res) => {
  try {
    const { reportType } = req.params;
    
    if (!['resident', 'guard'].includes(reportType)) {
      return res.status(400).json({ message: 'Invalid report type' });
    }
    
    const reports = await ReportLog.find({ reportType })
      .populate('userId', '-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error getting reports by type:', error);
    res.status(500).json({ message: 'Error getting reports by type' });
  }
};

// Obtener reportes por ID de usuario
const getReportsByUserId = async (req, res) => {
  try {
    const reports = await ReportLog.find({ userId: req.params.userId })
      .populate('userId', '-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error getting reports by user ID:', error);
    res.status(500).json({ message: 'Error getting reports by user ID' });
  }
};

// Obtener un reporte por ID
const getReportById = async (req, res) => {
  try {
    const report = await ReportLog.findById(req.params.id).populate('userId', '-password');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.status(200).json(report);
  } catch (error) {
    console.error('Error getting report:', error);
    res.status(500).json({ message: 'Error getting report' });
  }
};

module.exports = {
  createReport,
  createAdminReport,
  getAllReports,
  getReportsByType,
  getReportsByUserId,
  getReportById
};