# EduFocus - Aplicación Educativa Inteligente

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)]()
[![React Native](https://img.shields.io/badge/React_Native-0.74-blue)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)]()
[![Prisma](https://img.shields.io/badge/Prisma-5.22-purple)]()

Aplicación móvil para estudiantes de 8-18 años con tutor inteligente, planificación de tareas y modo focus.

## 🚀快速部署 (Deploy Rápido)

### Opción 1: Render (Gratis)

1. **Crear cuenta en [Render.com](https://render.com)**

2. **Fork del repositorio en GitHub**

3. **Crear Web Service en Render:**
   - Connect tu repositorio forked
   - Build Command: `cd backend && npm install && npx prisma generate`
   - Start Command: `cd backend && npm start`
   - Environment Variables:
     ```
     DATABASE_URL=postgresql://... (ver abajo)
     JWT_SECRET=tu-super-secreto-aqui
     GROQ_API_KEY=tu-api-key
     ```

4. **Crear PostgreSQL en Render:**
   - New → PostgreSQL
   - Selecciona el plan gratuito
   - Copia la conexión URL a `DATABASE_URL`

5. **Deploy del Frontend:**
   - New → Static Site
   - Connect repositorio
   - Build Command: `cd mobile && npm install`
   - Publish Directory: `dist`
   - Nota: Para web, primero ejecuta `npx expo export --platform web`

---

## 📁 Estructura del Proyecto

```
EduFocus/
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── routes/      # Endpoints REST
│   │   ├── services/    # Lógica de negocio
│   │   ├── middleware/  # Auth, errores
│   │   └── config/      # Database
│   └── prisma/
│       └── schema.prisma
├── mobile/               # App React Native + Expo
│   ├── src/
│   │   ├── screens/     # UI screens
│   │   ├── contexts/    # State management
│   │   ├── services/    # API client
│   │   └── navigation/  # Routing
│   └── App.js
└── README.md
```

---

## 🛠️ Desarrollo Local

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+ (o Docker)
- Git

### Configuración

```bash
# 1. Clonar
git clone https://github.com/TU_USUARIO/EduFocus.git
cd EduFocus

# 2. Backend
cd backend
cp .env.example .env
# Editar .env con tus credenciales

# Instalar y migrar
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev

# 3. Frontend (nueva terminal)
cd mobile
npm install
npm start
```

### Variables de Entorno Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/edufocus
JWT_SECRET=tu-clave-secreta-minimo-32-caracteres
GROQ_API_KEY=gsk_...
OPENAI_API_KEY=sk-... (opcional)
LLM_PROVIDER=groq
PORT=4000
```

### Variables de Entorno Mobile (.env)

```env
EXPO_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🎓 Características

| Módulo | Descripción |
|--------|-------------|
| 🤖 Tutor Inteligente | Guía socrático mediante preguntas |
| 📅 Planificador | Desglose de proyectos en micro-tareas |
| ⏱️ Modo Focus | Técnica Pomodoro con timer |
| 📝 Resumidor OCR | Procesa fotos de apuntes |
| 👨‍👩‍👧 Panel Padres | Seguimiento del progreso |

---

## 🔧 API Reference

### Autenticación
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
```

### Usuario
```
GET  /api/users/profile
GET  /api/users/stats
```

### Tareas
```
GET    /api/tasks
POST   /api/tasks
POST   /api/tasks/generate-plan
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

### Tutor
```
POST /api/tutor/conversations
POST /api/tutor/conversations/:id/message
GET  /api/tutor/hint/:subject
```

---

## 📱 Ejecutar App

```bash
# Web
npm run web

# Android (requiere emulador o dispositivo físico)
npm run android

# iOS (requiere Mac)
npm run ios
```

---

## 🏆 Gamificación

- **XP por tarea completada:** 10-50 XP
- **Bonus de racha:** +10 XP/día
- **Niveles:** Desbloquean funciones premium
- **Insignias:** Logros especiales

---

## 📄 Licencia

MIT License

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
