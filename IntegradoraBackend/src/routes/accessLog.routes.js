const express = require('express');
const router = express.Router();
const { createAccessLog, getAllAccessLogs, getAccessLogsByUserId, getAccessLogById } = require('../controllers/accessLog.controller');
const { validateToken, checkRole } = require('../middlewares/validateToken');
const { ROLES } = require('../schemas/role.enum');

// Middleware para proteger todas las rutas
router.use(validateToken);

// Rutas para guardias y administradores
router.post('/', checkRole([ROLES.ADMIN, ROLES.GUARD]), createAccessLog);
router.get('/', checkRole([ROLES.ADMIN, ROLES.GUARD]), getAllAccessLogs);
router.get('/user/:userId', checkRole([ROLES.ADMIN, ROLES.GUARD, ROLES.RESIDENT]), getAccessLogsByUserId);
router.get('/:id', checkRole([ROLES.ADMIN, ROLES.GUARD]), getAccessLogById);

module.exports = router;