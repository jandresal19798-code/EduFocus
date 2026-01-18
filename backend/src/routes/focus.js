import { Router } from 'express';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/session/start', async (req, res, next) => {
  try {
    const { subject, taskId, duration } = req.body;
    const pomodoroDuration = duration || 25;

    const session = await prisma.studySession.create({
      data: {
        studentId: req.user.id,
        subject,
        taskId,
        startTime: new Date(),
        isActive: true,
        pomodoros: {
          create: {
            type: 'FOCUS',
            startTime: new Date()
          }
        }
      },
      include: {
        pomodoros: true
      }
    });

    res.status(201).json({
      sessionId: session.id,
      pomodoroId: session.pomodoros[0].id,
      focusDuration: pomodoroDuration * 60,
      breakDuration: 5 * 60,
      longBreakAfter: 4
    });
  } catch (error) {
    next(error);
  }
});

router.post('/session/:sessionId/break', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { type } = req.body;

    const session = await prisma.studySession.findUnique({
      where: { id: sessionId },
      include: { pomodoros: true }
    });

    if (!session || session.studentId !== req.user.id) {
      throw new AppError('Sesión no encontrada', 404);
    }

    const completedPomodoros = session.pomodoros.filter(p => p.completed && p.type === 'FOCUS').length;
    const pomodoroType = type || (completedPomodoros % 4 === 3 ? 'LONG_BREAK' : 'SHORT_BREAK');
    const breakDuration = pomodoroType === 'LONG_BREAK' ? 15 * 60 : 5 * 60;

    const pomodoro = await prisma.pomodoroSession.create({
      data: {
        sessionId,
        type: pomodoroType,
        startTime: new Date()
      }
    });

    res.json({
      pomodoroId: pomodoro.id,
      breakType: pomodoroType,
      breakDuration
    });
  } catch (error) {
    next(error);
  }
});

router.post('/session/:sessionId/complete', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { pomodoroId, completed, type } = req.body;

    if (pomodoroId) {
      await prisma.pomodoroSession.update({
        where: { id: pomodoroId },
        data: {
          endTime: new Date(),
          completed
        }
      });
    }

    if (type === 'FOCUS' && completed) {
      await prisma.studentProfile.update({
        where: { userId: req.user.id },
        data: {
          totalXP: { increment: 5 },
          currentStreak: { increment: 1 }
        }
      });
    }

    const session = await prisma.studySession.update({
      where: { id: sessionId },
      data: {
        endTime: new Date(),
        isActive: false,
        duration: Math.round((Date.now() - new Date(req.body.startTime || Date.now())) / 60000)
      }
    });

    res.json({ 
      session,
      xpEarned: type === 'FOCUS' && completed ? 5 : 0
    });
  } catch (error) {
    next(error);
  }
});

router.get('/session/:sessionId', async (req, res, next) => {
  try {
    const session = await prisma.studySession.findUnique({
      where: { id: req.params.sessionId },
      include: { pomodoros: true }
    });

    if (!session || session.studentId !== req.user.id) {
      throw new AppError('Sesión no encontrada', 404);
    }

    res.json({ session });
  } catch (error) {
    next(error);
  }
});

router.get('/history', async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const sessions = await prisma.studySession.findMany({
      where: {
        studentId: req.user.id,
        startTime: { gte: since },
        isActive: false
      },
      include: { pomodoros: true },
      orderBy: { startTime: 'desc' }
    });

    const stats = sessions.reduce((acc, session) => {
      const focusMinutes = session.pomodoros
        .filter(p => p.type === 'FOCUS' && p.completed)
        .reduce((total, p) => {
          if (p.endTime && p.startTime) {
            return total + Math.round((p.endTime - p.startTime) / 60000);
          }
          return total;
        }, 0);

      if (!acc[session.subject]) {
        acc[session.subject] = { sessions: 0, minutes: 0 };
      }
      acc[session.subject].sessions += 1;
      acc[session.subject].minutes += focusMinutes;

      return acc;
    }, {});

    const totalMinutes = Object.values(stats).reduce((sum, s) => sum + s.minutes, 0);
    const totalSessions = sessions.length;

    res.json({ 
      sessions,
      stats: Object.entries(stats).map(([subject, data]) => ({ subject, ...data })),
      summary: { totalMinutes, totalSessions }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
