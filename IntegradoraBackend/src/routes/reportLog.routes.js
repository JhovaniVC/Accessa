const express = require('express');
const router = express.Router();
const { 
  createReport, 
  createAdminReport,
  getAllReports, 
  getReportsByType,
  getReportsByUserId, 
  getReportById 
} = require('../controllers/reportLog.controller');
const { validateToken, checkRole } = require('../middlewares/validateToken');
const { ROLES } = require('../schemas/role.enum');
const multer = require('multer');
const path = require('path');

// Configuración de multer para guardar imágenes en /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Middleware para proteger todas las rutas
router.use(validateToken);

// Rutas para residentes
router.post('/', checkRole([ROLES.RESIDENT]), upload.single('image'), createReport);

// Rutas para guardias
router.post('/admin', checkRole([ROLES.GUARD]), createAdminReport);

// Rutas para administradores y guardias
router.get('/', checkRole([ROLES.ADMIN, ROLES.GUARD]), getAllReports);
router.get('/type/:reportType', checkRole([ROLES.ADMIN, ROLES.GUARD]), getReportsByType);

// Rutas para usuarios específicos
router.get('/user/:userId', checkRole([ROLES.ADMIN, ROLES.RESIDENT, ROLES.GUARD]), getReportsByUserId);
router.get('/:id', checkRole([ROLES.ADMIN, ROLES.RESIDENT, ROLES.GUARD]), getReportById);

module.exports = router;