const Notification = require('../models/notification');
const User = require('../models/user');

// Crear una nueva notificación
const createNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;

    // Verificar si el usuario existe
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({ message: 'User not found' });
    }

    const newNotification = new Notification({
      userId,
      type,
      message
    });

    await newNotification.save();

    res.status(201).json({
      message: 'Notification created successfully',
      notification: newNotification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Error creating notification' });
  }
};

// Crear una alerta de pánico (nueva función)
const createPanicAlert = async (req, res) => {
  try {
    const userId = req.user._id; // El usuario que envía la alerta (obtenido del token)
    const { location, details } = req.body;
    
    // Buscar guardias para enviarles la notificación
    const guards = await User.find({ 'roleId.name': 'guard', state: true });
    
    if (guards.length === 0) {
      return res.status(404).json({ message: 'No active guards found to receive the alert' });
    }
    
    // Crear mensaje de alerta - simplificado sin campos adicionales
    const message = `¡ALERTA DE PÁNICO! ${req.user.name} ${req.user.paternalSurname} necesita ayuda urgente`;
    
    // Crear notificaciones para cada guardia
    const notificationPromises = guards.map(guard => {
      const notification = new Notification({
        userId: guard._id,
        type: 'PANIC_ALERT',
        message
      });
      return notification.save();
    });
    
    await Promise.all(notificationPromises);
    
    res.status(201).json({
      message: 'Panic alert sent successfully to all guards',
      alertCount: guards.length
    });
  } catch (error) {
    console.error('Error creating panic alert:', error);
    res.status(500).json({ message: 'Error creating panic alert' });
  }
};

// Obtener todas las notificaciones
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('userId', '-password').sort({ date: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ message: 'Error getting notifications' });
  }
};

// Obtener notificaciones por ID de usuario
const getNotificationsByUserId = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .populate('userId', '-password')
      .sort({ date: -1 });
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error getting notifications by user ID:', error);
    res.status(500).json({ message: 'Error getting notifications by user ID' });
  }
};

// Obtener alertas de pánico (nueva función)
const getPanicAlerts = async (req, res) => {
  try {
    const panicAlerts = await Notification.find({ type: 'PANIC_ALERT' })
      .populate('userId', '-password')
      .sort({ date: -1 });
    
    res.status(200).json(panicAlerts);
  } catch (error) {
    console.error('Error getting panic alerts:', error);
    res.status(500).json({ message: 'Error getting panic alerts' });
  }
};

// Marcar notificación como leída
const markNotificationAsRead = async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { state: true },
      { new: true }
    ).populate('userId', '-password');
    
    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json({
      message: 'Notification marked as read',
      notification: updatedNotification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};

// Marcar todas las notificaciones de un usuario como leídas
const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, state: false },
      { state: true }
    );
    
    res.status(200).json({
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Error marking all notifications as read' });
  }
};

module.exports = {
  createNotification,
  createPanicAlert,
  getAllNotifications,
  getNotificationsByUserId,
  getPanicAlerts,
  markNotificationAsRead,
  markAllNotificationsAsRead
};