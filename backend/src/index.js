import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
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

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:8083', 'http://localhost:8084', 'http://localhost:8085', 'http://localhost:8086', 'http://localhost:8090', 'http://localhost:8095'],
  credentials: true
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/favicon.ico', (req, res) => {
  res.redirect('/favicon.svg');
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/tutor', authenticateToken, tutorRoutes);
app.use('/api/focus', authenticateToken, focusRoutes);
app.use('/api/content', authenticateToken, contentRoutes);
app.use('/api/progress', authenticateToken, progressRoutes);
app.use('/api/parent', authenticateToken, parentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 EduFocus Backend ejecutándose en puerto ${PORT}`);
});

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
