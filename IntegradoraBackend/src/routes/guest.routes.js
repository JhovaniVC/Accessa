const express = require('express');
const router = express.Router();
const { createGuest, getAllGuests, getGuestById, updateGuest, registerGuestUse } = require('../controllers/guest.controller');
const { validateToken, checkRole } = require('../middlewares/validateToken');
const { ROLES } = require('../schemas/role.enum');

// Middleware para proteger todas las rutas
router.use(validateToken);

// Rutas para residentes y administradores
router.post('/', checkRole([ROLES.ADMIN, ROLES.RESIDENT]), createGuest);

// Rutas para guardias y administradores
router.get('/', checkRole([ROLES.ADMIN, ROLES.GUARD]), getAllGuests);
router.get('/:id', checkRole([ROLES.ADMIN, ROLES.GUARD, ROLES.RESIDENT]), getGuestById);
router.put('/:id', checkRole([ROLES.ADMIN, ROLES.GUARD]), updateGuest);
router.put('/:id/use', checkRole([ROLES.ADMIN, ROLES.GUARD]), registerGuestUse);

module.exports = router;