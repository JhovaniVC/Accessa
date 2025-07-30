const express = require('express');
const router = express.Router();
const { createQRCode, getAllQRCodes, getQRCodesByUserId, getQRCodeByToken, acreditateQRCode, registerQRCodeUse } = require('../controllers/qrCode.controller');
const { validateToken, checkRole } = require('../middlewares/validateToken');
const { ROLES } = require('../schemas/role.enum');

// Middleware para proteger todas las rutas excepto getQRCodeByToken
router.use('/:token', (req, res, next) => {
  if (req.params.token) return next();
  validateToken(req, res, next);
});

// Ruta pública para verificar un código QR por token
router.get('/:token', getQRCodeByToken);

// Middleware para proteger el resto de rutas
router.use(validateToken);

// Rutas para residentes y administradores
router.post('/', checkRole([ROLES.ADMIN, ROLES.RESIDENT]), createQRCode);

// Rutas para guardias y administradores
router.get('/', checkRole([ROLES.ADMIN, ROLES.GUARD]), getAllQRCodes);
router.get('/user/:userId', checkRole([ROLES.ADMIN, ROLES.RESIDENT, ROLES.GUARD]), getQRCodesByUserId);
router.put('/:id/acreditate', checkRole([ROLES.ADMIN, ROLES.GUARD]), acreditateQRCode);
router.put('/:id/use', checkRole([ROLES.ADMIN, ROLES.GUARD]), registerQRCodeUse);

module.exports = router;