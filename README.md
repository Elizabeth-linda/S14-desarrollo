# Proyecto Desarrollo Web - Sistema CRUD con Autenticación

Aplicación web fullstack con autenticación JWT, OAuth Google y operaciones CRUD utilizando MongoDB como base de datos NoSQL.

## 🌐 URLs de Producción

- **Frontend:** https://frontend-s14-desarrollo.vercel.app
- **Backend API:** https://s14-desarrollo.onrender.com

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken) para autenticación
- bcryptjs para encriptación
- Passport.js + Google OAuth 2.0
- Helmet (seguridad)
- express-rate-limit
- CORS

### Frontend
- React
- Vite
- Axios
- React Router

### Infraestructura
- MongoDB Atlas (base de datos)
- Render (backend)
- Vercel (frontend)
- GitHub (control de versiones)

## 📁 Estructura del Proyecto
```
S14-desarrollo/
│
├── backend/
│   ├── config/
│   │   └── passport.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── googleAuth.js
│   │   └── users.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🚀 Instalación Local

### Prerrequisitos
- Node.js 
- npm
- MongoDB Atlas 

### Backend
```bash
cd backend
npm install
```

Crear archivo `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://elizabethrivera1677_db_user:Ell1802zz@cluster0.oyl4tlw.mongodb.net/desarrollo_web?retryWrites=true&w=majority
JWT_SECRET=mi_clave_super_secreta_elizabeth_2024
JWT_EXPIRE=7d
SESSION_SECRET=mi_session_secreta_elizabeth_2024
FRONTEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=esto es secreto....
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

```

Iniciar servidor:
```bash
npm start
```

### Frontend
```bash
cd frontend
npm install
```

Crear archivo `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Iniciar aplicación:
```bash
npm run dev
```

## 📋 Funcionalidades

### Autenticación
- ✅ Registro de usuarios
- ✅ Login con JWT
- ✅ OAuth 2.0 con Google
- ✅ Protección de rutas con middleware
- ✅ Encriptación de contraseñas

### CRUD de Usuarios
- ✅ Crear usuarios
- ✅ Listar usuarios
- ✅ Actualizar usuarios
- ✅ Eliminar usuarios
- ✅ Validación de datos

### Seguridad
- ✅ Rate limiting
- ✅ Headers de seguridad (Helmet)
- ✅ CORS configurado

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/google` - OAuth Google

### Usuarios (requieren token)
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Utilidades
- `GET /` - Información API
- `GET /health` - Estado del servidor

## 🧪 Ejemplo de Uso con Postman

### 1. Registro
```http
POST https://s14-desarrollo.onrender.com/api/auth/register
Content-Type: application/json

{
  "nombre": "Usuario Test",
  "email": "test@ejemplo.com",
  "password": "Password123"
}
```

### 2. Login
```http
POST https://s14-desarrollo.onrender.com/api/auth/login
Content-Type: application/json

{
  "email": "elizabeth18@gmail.com",
  "password": "Password123"
}
```

### 3. Listar Usuarios
```http
GET https://s14-desarrollo.onrender.com/api/users
Authorization: Bearer {tu_token_jwt}
```

##  Modelo de Datos
```javascript
User {
  nombre: String,
  email: String (único),
  password: String (encriptado),
  rol: String (default: "usuario"),
  createdAt: Date,
  updatedAt: Date
}
```

##  Variables de Entorno

### Backend
| Variable | Descripción |
|----------|-------------|
| PORT | Puerto del servidor |
| MONGODB_URI | URL de MongoDB Atlas |
| JWT_SECRET | Clave secreta JWT |
| GOOGLE_CLIENT_ID | ID OAuth Google |
| GOOGLE_CLIENT_SECRET | Secret OAuth Google |
| NODE_ENV | Entorno (production/development) |

### Frontend
| Variable | Descripción |
|----------|-------------|
| VITE_API_URL | URL del backend API |

##  Deploy

### Backend (Render)
1. Conectar repositorio GitHub
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Agregar variables de entorno

### Frontend (Vercel)
1. Importar repositorio GitHub
2. Root Directory: `frontend`
3. Framework: Vite
4. Agregar variables de entorno
5. Deploy

## 📝 Notas

- El backend puede tardar ~30 segundos en responder la primera vez (Render hiberna servicios gratuitos)
- MongoDB Atlas requiere IP whitelisting (configurar 0.0.0.0/0 para acceso global)
- Los tokens JWT expiran después de un tiempo configurado



**Repositorio:** https://github.com/Elizabeth-linda/S14-desarrollo.git
