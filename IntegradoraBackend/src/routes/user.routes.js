const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, changePassword, updateUser, changeUserState, deleteUser } = require('../controllers/user.controller');
const { validateToken, checkRole } = require('../middlewares/validateToken');
const { ROLES } = require('../schemas/role.enum');

// Middleware para proteger todas las rutas
router.use(validateToken);

// Ruta para cambiar contraseña (accesible para todos los usuarios autenticados)
router.put('/change-password', changePassword);

// Rutas para administradores
router.get('/', checkRole([ROLES.ADMIN]), getAllUsers);
router.put('/:id/state', checkRole([ROLES.ADMIN]), changeUserState);
router.delete('/:id', checkRole([ROLES.ADMIN]), deleteUser);

// Rutas para usuarios y administradores
router.get('/:id', checkRole([ROLES.ADMIN, ROLES.USER, ROLES.RESIDENT, ROLES.GUARD]), getUserById);
router.put('/:id', checkRole([ROLES.ADMIN, ROLES.USER, ROLES.RESIDENT]), updateUser);

module.exports = router;