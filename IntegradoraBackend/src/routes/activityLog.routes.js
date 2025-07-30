const express = require('express');
const router = express.Router();
const { 
  createActivityLog, 
  getAllActivityLogs, 
  getActivityLogsByUserId, 
  getActivityLogsByType,
  getActivityLogsByUserIdAndType
} = require('../controllers/activityLog.controller');
const { validateToken, checkRole } = require('../middlewares/validateToken');
const { ROLES } = require('../schemas/role.enum');

// Middleware para proteger todas las rutas
router.use(validateToken);

// Rutas para administradores
router.post('/', checkRole([ROLES.ADMIN]), createActivityLog);
router.get('/', checkRole([ROLES.ADMIN]), getAllActivityLogs);
router.get('/type/:activityType', checkRole([ROLES.ADMIN]), getActivityLogsByType);

// Rutas para usuarios específicos
router.get('/user/:userId', checkRole([ROLES.ADMIN, ROLES.RESIDENT, ROLES.GUARD]), getActivityLogsByUserId);
router.get('/user/:userId/type/:activityType', checkRole([ROLES.ADMIN, ROLES.RESIDENT, ROLES.GUARD]), getActivityLogsByUserIdAndType);

module.exports = router;