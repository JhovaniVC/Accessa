const express = require('express');
const router = express.Router();
const { 
  createNotification, 
  createPanicAlert,
  getAllNotifications, 
  getNotificationsByUserId, 
  getPanicAlerts,
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} = require('../controllers/notification.controller');
const { validateToken, checkRole } = require('../middlewares/validateToken');
const { ROLES } = require('../schemas/role.enum');

// Middleware para proteger todas las rutas
router.use(validateToken);

// Rutas para administradores
router.post('/', checkRole([ROLES.ADMIN]), createNotification);
router.get('/', checkRole([ROLES.ADMIN]), getAllNotifications);

// Ruta para botón de pánico (accesible para residentes)
router.post('/panic-alert', checkRole([ROLES.RESIDENT]), createPanicAlert);

// Ruta para obtener alertas de pánico (accesible para guardias y administradores)
router.get('/panic-alerts', checkRole([ROLES.ADMIN, ROLES.GUARD]), getPanicAlerts);

// Rutas para usuarios
router.get('/user/:userId', checkRole([ROLES.ADMIN, ROLES.USER, ROLES.RESIDENT, ROLES.GUARD]), getNotificationsByUserId);
router.put('/:id/read', checkRole([ROLES.ADMIN, ROLES.USER, ROLES.RESIDENT, ROLES.GUARD]), markNotificationAsRead);
router.put('/user/:userId/read-all', checkRole([ROLES.ADMIN, ROLES.USER, ROLES.RESIDENT, ROLES.GUARD]), markAllNotificationsAsRead);

module.exports = router;