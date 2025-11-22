const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      success: true,
      message: 'Login con Google exitoso',
      data: {
        usuario: req.user,
        token
      }
    });
  }
);

module.exports = router;
