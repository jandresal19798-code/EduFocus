import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { connectDB, disconnectDB, default as prisma } from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import taskRoutes from './routes/tasks.js';
import tutorRoutes from './routes/tutor.js';
import focusRoutes from './routes/focus.js';
import contentRoutes from './routes/content.js';
import progressRoutes from './routes/progress.js';
import parentRoutes from './routes/parent.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/tutor' });

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:8083',
  'http://localhost:8084',
  'http://localhost:8085',
  'http://localhost:8086',
  'http://localhost:8090',
  'http://localhost:8095',
  '.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.some(oa => origin.includes(oa) || oa.startsWith('.'))) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.json({ status: 'ok', database: 'disconnected', timestamp: new Date().toISOString() });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API funciona correctamente', version: '1.0.0' });
});

// Seed educational tasks (admin only)
app.post('/api/seed-tasks', async (req, res) => {
  try {
    const { default: seedTasks } = await import('./services/seedTasks.js');
    
    // Check if user is admin (for security)
    const user = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    // Allow any authenticated user to seed for testing
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    
    await seedTasks();
    res.json({ message: 'Tareas educativas sembradas correctamente' });
  } catch (error) {
    console.error('Error en seed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Direct test route for register
app.post('/api/register-direct', async (req, res) => {
  try {
    const { email, password, birthDate, role } = req.body;
    res.json({ 
      received: { email, password, birthDate, role },
      message: 'Datos recibidos correctamente'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/tutor', authenticateToken, tutorRoutes);
app.use('/api/focus', authenticateToken, focusRoutes);
app.use('/api/content', authenticateToken, contentRoutes);
app.use('/api/progress', authenticateToken, progressRoutes);
app.use('/api/parent', authenticateToken, parentRoutes);

app.use(errorHandler);

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Not Found',
    message: `Ruta ${req.method} ${req.path} no encontrada`,
    path: req.path,
    method: req.method,
    availableRoutes: ['/health', '/api/health', '/api/test', '/api/auth/login', '/api/auth/register']
  });
});

const PORT = process.env.PORT || 4000;

// Start server
async function startServer() {
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.log('⚠️  Advertencia: Base de datos no conectada. La API funcionará en modo limitado.');
    console.log('📝 Verifica que DATABASE_URL esté configurada correctamente en Environment Variables.');
  }

  server.listen(PORT, () => {
    console.log(`🚀 EduFocus Backend ejecutándose en puerto ${PORT}`);
    if (dbConnected) {
      console.log(`✅ Base de datos: Conectada`);
    } else {
      console.log(`❌ Base de datos: Desconectada`);
    }
  });
}

startServer().catch(console.error);

wss.on('connection', (ws, req) => {
  console.log('Nueva conexión WebSocket');
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'tutor_message') {
        ws.send(JSON.stringify({
          type: 'tutor_response',
          content: processTutorMessage(data.content, data.context)
        }));
      }
    } catch (e) {
      console.error('Error procesando mensaje WebSocket:', e);
    }
  });
});

function processTutorMessage(content, context) {
  return {
    reply: `Entiendo tu pregunta sobre "${content}". Vamos a resolverlo paso a paso.`,
    nextQuestion: '¿Qué datos del problema has identificado hasta ahora?'
  };
}

export default app;
