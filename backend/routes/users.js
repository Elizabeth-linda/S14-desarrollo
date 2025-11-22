const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protegerRuta } = require('../middleware/auth');

// Proteger todas las rutas
router.use(protegerRuta);

// Verificar si es admin
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para realizar esta acción'
    });
  }
  next();
};

// Obtener todos los usuarios (admin)
router.get('/', soloAdmin, async (req, res) => {
  try {
    const { search = '' } = req.query;

    const filtro = search
      ? {
          $or: [
            { nombre: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const usuarios = await User.find(filtro).select('-password');

    res.json({
      success: true,
      data: { usuarios }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

// Obtener un usuario por ID (admin)
router.get('/:id', soloAdmin, async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select('-password');

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: { usuario }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
});

// Actualizar usuario (admin)
router.put('/:id', soloAdmin, async (req, res) => {
  try {
    const { nombre, email, rol, activo } = req.body;

    const usuario = await User.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir email duplicado
    if (email && email !== usuario.email) {
      const existeEmail = await User.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }
    }

    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (rol) usuario.rol = rol;
    if (activo !== undefined) usuario.activo = activo;

    await usuario.save();

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: {
        usuario: {
          _id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          activo: usuario.activo
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
});

// Eliminar usuario (admin)
router.delete('/:id', soloAdmin, async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await usuario.deleteOne();

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
});

module.exports = router;
