const { verifyToken } = require('../libs/jwt');
const User = require('../models/user');

const validateToken = async (req, res, next) => {
  try {
    // Obtener el token del encabezado de autorización o de las cookies
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verificar el token
    const decoded = await verifyToken(token);
    
    // Verificar si el usuario existe en la base de datos
    const user = await User.findById(decoded.id).populate('roleId');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }
    
    // Verificar si el usuario está activo
    if (!user.state) {
      return res.status(401).json({ message: 'User is inactive' });
    }
    
    // Agregar el usuario al objeto de solicitud
    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware para verificar roles
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const hasRole = roles.includes(req.user.roleId.name);
    
    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
};

module.exports = {
  validateToken,
  checkRole
};