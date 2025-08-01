const express = require('express');
const router = express.Router();
const { 
  createBitacora, 
  getAllBitacoras, 
  getBitacorasByType, 
  getBitacorasByUserId, 
  getBitacoraById, 
  updateBitacora, 
  deleteBitacora 
} = require('../controllers/bitacora.controller');
const { validateToken, checkRole } = require('../middlewares/validateToken');
const { ROLES } = require('../schemas/role.enum');

// Middleware para proteger todas las rutas
router.use(validateToken);

// Rutas para guardias y administradores
router.post('/', checkRole([ROLES.ADMIN, ROLES.GUARD]), createBitacora);
router.get('/', checkRole([ROLES.ADMIN, ROLES.GUARD]), getAllBitacoras);
router.get('/type/:tipo', checkRole([ROLES.ADMIN, ROLES.GUARD]), getBitacorasByType);
router.get('/user/:userId', checkRole([ROLES.ADMIN, ROLES.GUARD]), getBitacorasByUserId);
router.get('/:id', checkRole([ROLES.ADMIN, ROLES.GUARD]), getBitacoraById);
router.put('/:id', checkRole([ROLES.ADMIN, ROLES.GUARD]), updateBitacora);
router.delete('/:id', checkRole([ROLES.ADMIN, ROLES.GUARD]), deleteBitacora);

module.exports = router; 