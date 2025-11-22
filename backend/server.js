// server.js (versión final con OAuth + seguridad + todo lo requerido)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const passport = require('./config/passport'); // ⬅️ INTEGRACIÓN OAUTH

// Cargar variables de entorno
dotenv.config();
console.log('⚠️ DEBUG ENV:');
console.log('CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'OK' : 'EMPTY');
console.log('CALLBACK:', process.env.GOOGLE_CALLBACK_URL);
console.log('MONGO:', process.env.MONGODB_URI ? 'OK' : 'EMPTY');

// Rutas
const authRoutes = require('./routes/auth');
const googleAuthRoutes = require('./routes/googleAuth'); // ⬅️ NUEVA RUTA
const userRoutes = require('./routes/users');

const app = express();

// Seguridad básica
app.use(helmet());

// Rate limiter (protección básica contra abuso)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Logger
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Inicializar Passport (OAuth Google)
app.use(passport.initialize());

// Health check
app.get('/health', async (req, res) => {
  const dbState = mongoose.connection.readyState; 
  res
    .status(dbState === 1 ? 200 : 503)
    .json({ status: dbState === 1 ? 'ok' : 'down', dbState });
});

// Conexión robusta a MongoDB
const connectWithRetry = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch((err) => {
      console.error('❌ Error conectando a MongoDB:', err.message || err);
      console.log('Reintentando conexión en 5 segundos...');
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Rutas principales
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API de Desarrollo Web - UNEMI',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes); // ⬅️ OAuth Google
app.use('/api/users', userRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

// Manejo de cierre ordenado
const gracefulShutdown = (signal) => {
  console.log(`\n> Recibida señal ${signal}. Cerrando servidor...`);
  server.close(() => {
    mongoose.disconnect().then(() => {
      console.log('MongoDB desconectado. Proceso finalizado.');
      process.exit(0);
    });
  });

  // Forzar cierre tras 10s
  setTimeout(() => {
    console.error('Cierre forzado.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Errores no manejados
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});
