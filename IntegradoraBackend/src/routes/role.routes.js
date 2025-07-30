const express = require('express');
const router = express.Router();

const { createRole, getAllRoles } = require('../controllers/role.controller');
const { validateToken, checkRole } = require('../middlewares/validateToken');
const { ROLES } = require('../schemas/role.enum');

// Proteger todas las rutas con validación de token
router.use(validateToken);

// Sólo admin puede crear roles
router.post('/', checkRole([ROLES.ADMIN]), createRole);

// Todos los roles autenticados pueden listar roles, o puedes limitar también si quieres
router.get('/', getAllRoles);

module.exports = router;
