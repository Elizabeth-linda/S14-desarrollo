// backend/config/passport.js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Debug para ver si las vars están presentes
console.log('> DEBUG passport - GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'OK' : 'MISSING');
console.log('> DEBUG passport - GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL ? process.env.GOOGLE_CALLBACK_URL : 'MISSING');

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;

// Solo configurar Google OAuth si todas las variables están presentes y no son 'none'
if (clientID && clientSecret && callbackURL && 
    clientID !== 'none' && clientSecret !== 'none' && callbackURL !== 'none') {
  
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] && profile.emails[0].value;
          if (!email) return done(new Error('No email returned by Google'), null);

          let usuario = await User.findOne({ email });
          if (!usuario) {
            usuario = await User.create({
              nombre: profile.displayName || email,
              email,
              password: 'google_oauth_default',
              rol: 'usuario'
            });
          }
          return done(null, usuario);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  console.log('✅ Google OAuth configurado correctamente');
} else {
  console.warn('⚠️ Google OAuth deshabilitado - Configura GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET y GOOGLE_CALLBACK_URL para habilitarlo');
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, id));

module.exports = passport;