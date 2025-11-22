const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas
const protegerRuta = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.usuario = await User.findById(decoded.id).select('-password');
      
      if (!req.usuario) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'No hay token'
    });
  }
};

module.exports = { protegerRuta };