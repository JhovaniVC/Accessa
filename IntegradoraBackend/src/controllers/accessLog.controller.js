const AccessLog = require('../models/accessLog');

// Crear un nuevo registro de acceso de paquetería
const createAccessLog = async (req, res) => {
  try {
    const {
      deliveredBy,
      courierCompany,
      department,
      receivedBy,
      description,
      status = 'entregado',
      comments
    } = req.body;

    // Obtener el usuario que registra (desde el middleware de autenticación)
    const registeredBy = req.user._id;

    const newAccessLog = new AccessLog({
      deliveredBy,
      courierCompany,
      department,
      receivedBy,
      description,
      status,
      comments,
      registeredBy
    });

    await newAccessLog.save();

    // Populate el usuario que registró
    await newAccessLog.populate('registeredBy', '-password');

    res.status(201).json({
      message: 'Registro de acceso creado exitosamente',
      accessLog: newAccessLog
    });
  } catch (error) {
    console.error('Error creating access log:', error);
    res.status(500).json({ message: 'Error al crear el registro de acceso' });
  }
};

// Obtener todos los registros de acceso
const getAllAccessLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, department, status, dateFrom, dateTo } = req.query;
    
    // Construir filtros
    const filters = {};
    
    if (department) {
      filters.department = { $regex: department, $options: 'i' };
    }
    
    if (status) {
      filters.status = status;
    }
    
    if (dateFrom || dateTo) {
      filters.accessDate = {};
      if (dateFrom) filters.accessDate.$gte = new Date(dateFrom);
      if (dateTo) filters.accessDate.$lte = new Date(dateTo);
    }

    const skip = (page - 1) * limit;
    
    const accessLogs = await AccessLog.find(filters)
      .populate('registeredBy', 'name paternalSurname maternalSurname')
      .sort({ accessDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AccessLog.countDocuments(filters);

    res.status(200).json({
      accessLogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting access logs:', error);
    res.status(500).json({ message: 'Error al obtener los registros de acceso' });
  }
};

// Obtener registros de acceso por departamento
const getAccessLogsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const accessLogs = await AccessLog.find({ 
      department: { $regex: department, $options: 'i' } 
    })
      .populate('registeredBy', 'name paternalSurname maternalSurname')
      .sort({ accessDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AccessLog.countDocuments({ 
      department: { $regex: department, $options: 'i' } 
    });

    res.status(200).json({
      accessLogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting access logs by department:', error);
    res.status(500).json({ message: 'Error al obtener registros por departamento' });
  }
};

// Obtener un registro de acceso por ID
const getAccessLogById = async (req, res) => {
  try {
    const accessLog = await AccessLog.findById(req.params.id)
      .populate('registeredBy', 'name paternalSurname maternalSurname');
    
    if (!accessLog) {
      return res.status(404).json({ message: 'Registro de acceso no encontrado' });
    }
    
    res.status(200).json(accessLog);
  } catch (error) {
    console.error('Error getting access log:', error);
    res.status(500).json({ message: 'Error al obtener el registro de acceso' });
  }
};

// Actualizar un registro de acceso
const updateAccessLog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const accessLog = await AccessLog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('registeredBy', 'name paternalSurname maternalSurname');

    if (!accessLog) {
      return res.status(404).json({ message: 'Registro de acceso no encontrado' });
    }

    res.status(200).json({
      message: 'Registro de acceso actualizado exitosamente',
      accessLog
    });
  } catch (error) {
    console.error('Error updating access log:', error);
    res.status(500).json({ message: 'Error al actualizar el registro de acceso' });
  }
};

// Eliminar un registro de acceso
const deleteAccessLog = async (req, res) => {
  try {
    const accessLog = await AccessLog.findByIdAndDelete(req.params.id);
    
    if (!accessLog) {
      return res.status(404).json({ message: 'Registro de acceso no encontrado' });
    }

    res.status(200).json({ message: 'Registro de acceso eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting access log:', error);
    res.status(500).json({ message: 'Error al eliminar el registro de acceso' });
  }
};

// Obtener estadísticas de accesos
const getAccessLogStats = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    
    const filters = {};
    if (dateFrom || dateTo) {
      filters.accessDate = {};
      if (dateFrom) filters.accessDate.$gte = new Date(dateFrom);
      if (dateTo) filters.accessDate.$lte = new Date(dateTo);
    }

    const stats = await AccessLog.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          entregados: {
            $sum: { $cond: [{ $eq: ['$status', 'entregado'] }, 1, 0] }
          },
          pendientes: {
            $sum: { $cond: [{ $eq: ['$status', 'pendiente'] }, 1, 0] }
          },
          rechazados: {
            $sum: { $cond: [{ $eq: ['$status', 'rechazado'] }, 1, 0] }
          }
        }
      }
    ]);

    const departmentStats = await AccessLog.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      general: stats[0] || { total: 0, entregados: 0, pendientes: 0, rechazados: 0 },
      byDepartment: departmentStats
    });
  } catch (error) {
    console.error('Error getting access log stats:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

module.exports = {
  createAccessLog,
  getAllAccessLogs,
  getAccessLogsByDepartment,
  getAccessLogById,
  updateAccessLog,
  deleteAccessLog,
  getAccessLogStats
};