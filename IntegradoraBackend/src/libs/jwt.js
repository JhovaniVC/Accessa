const jwt = require('jsonwebtoken');
require('dotenv').config();

// Obtener la clave desde las variables de entorno o usar una predeterminada
const JWT_SECRET = process.env.JWT_SECRET || 'Accesad';

// Generar un token JWT
const createToken = (payload, expiresIn = '1d') => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

// Verificar un token JWT
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

module.exports = {
  createToken,
  verifyToken
};