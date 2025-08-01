const express = require('express');
const router = express.Router();
const { 
  createAccessLog, 
  getAllAccessLogs, 
  getAccessLogsByDepartment, 
  getAccessLogById,
  updateAccessLog,
  deleteAccessLog,
  getAccessLogStats
} = require('../controllers/accessLog.controller');
const { validateToken, checkRole } = require('../middlewares/validateToken');
const { ROLES } = require('../schemas/role.enum');

// Middleware para proteger todas las rutas
router.use(validateToken);

// Rutas para guardias y administradores
router.post('/', checkRole([ROLES.ADMIN, ROLES.GUARD]), createAccessLog);
router.get('/', checkRole([ROLES.ADMIN, ROLES.GUARD]), getAllAccessLogs);
router.get('/stats', checkRole([ROLES.ADMIN, ROLES.GUARD]), getAccessLogStats);
router.get('/department/:department', checkRole([ROLES.ADMIN, ROLES.GUARD]), getAccessLogsByDepartment);
router.get('/:id', checkRole([ROLES.ADMIN, ROLES.GUARD]), getAccessLogById);
router.put('/:id', checkRole([ROLES.ADMIN, ROLES.GUARD]), updateAccessLog);
router.delete('/:id', checkRole([ROLES.ADMIN]), deleteAccessLog);

module.exports = router;