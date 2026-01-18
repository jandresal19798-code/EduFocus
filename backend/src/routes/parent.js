import { Router } from 'express';
import prisma from '../config/database.js';

const router = Router();

router.get('/children', async (req, res, next) => {
  try {
    if (req.user.role !== 'PARENT') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const children = await prisma.studentProfile.findMany({
      where: { parentId: req.user.id },
      include: {
        user: { select: { email: true } },
        badges: true
      }
    });

    res.json({ children });
  } catch (error) {
    next(error);
  }
});

router.get('/child/:childId/progress', async (req, res, next) => {
  try {
    if (req.user.role !== 'PARENT') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { childId } = req.params;
    const { days = 30 } = req.query;

    const child = await prisma.studentProfile.findFirst({
      where: { id: childId, parentId: req.user.id }
    });

    if (!child) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [progressRecords, tasks, studySessions, profile] = await Promise.all([
      prisma.progressRecord.findMany({
        where: { studentId: child.userId, recordedAt: { gte: since } },
        orderBy: { recordedAt: 'desc' }
      }),
      prisma.task.findMany({
        where: { studentId: child.userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.studySession.findMany({
        where: { studentId: child.userId, startTime: { gte: since } },
        orderBy: { startTime: 'desc' }
      }),
      prisma.studentProfile.findUnique({
        where: { id: childId }
      })
    ]);

    const totalTime = progressRecords.reduce((sum, r) => sum + r.timeSpent, 0);
    const avgMastery = progressRecords.length > 0
      ? Math.round(progressRecords.reduce((sum, r) => sum + r.masteryLevel, 0) / progressRecords.length)
      : 0;

    const tasksCompleted = tasks.filter(t => t.isCompleted).length;
    const tasksPending = tasks.filter(t => !t.isCompleted).length;

    const subjectsMastery = progressRecords.reduce((acc, r) => {
      if (!acc[r.subject]) {
        acc[r.subject] = { total: 0, count: 0 };
      }
      acc[r.subject].total += r.masteryLevel;
      acc[r.subject].count += 1;
      return acc;
    }, {});

    const recentActivity = [
      ...studySessions.slice(0, 5).map(s => ({
        type: 'study',
        date: s.startTime,
        subject: s.subject,
        duration: s.duration
      })),
      ...tasks.slice(0, 5).map(t => ({
        type: 'task',
        date: t.createdAt,
        title: t.title,
        completed: t.isCompleted
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    const areasDificultad = progressRecords
      .filter(r => r.masteryLevel < 50)
      .reduce((acc, r) => {
        if (!acc[r.topic]) {
          acc[r.topic] = { subject: r.subject, avgMastery: [], count: 0 };
        }
        acc[r.topic].avgMastery.push(r.masteryLevel);
        acc[r.topic].count += 1;
        return acc;
      }, {});

    const difficulties = Object.entries(areasDificultad)
      .map(([topic, data]) => ({
        topic,
        subject: data.subject,
        avgMastery: Math.round(data.avgMastery.reduce((a, b) => a + b, 0) / data.count)
      }))
      .filter(d => d.avgMastery < 50)
      .sort((a, b) => a.avgMastery - b.avgMastery);

    res.json({
      overview: {
        name: child.displayName,
        level: profile.level,
        streak: profile.currentStreak,
        totalXP: profile.totalXP
      },
      stats: {
        totalTimeMinutes: totalTime,
        avgMastery,
        tasksCompleted,
        tasksPending,
        studyDays: new Set(studySessions.map(s => s.startTime.toDateString())).size
      },
      subjects: Object.entries(subjectsMastery).map(([subject, data]) => ({
        subject,
        avgMastery: Math.round(data.total / data.count)
      })),
      recentActivity,
      difficulties,
      gamification: {
        level: profile.level,
        badges: child.badges.length,
        totalXP: profile.totalXP
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/child/:childId/schedule', async (req, res, next) => {
  try {
    if (req.user.role !== 'PARENT') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { childId } = req.params;
    const { days = 7 } = req.query;

    const child = await prisma.studentProfile.findFirst({
      where: { id: childId, parentId: req.user.id }
    });

    if (!child) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    const since = new Date();
    const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const [projects, tasks, studySessions] = await Promise.all([
      prisma.project.findMany({
        where: { 
          studentId: child.userId,
          deadline: { gte: since, lte: until }
        },
        include: { tasks: true }
      }),
      prisma.task.findMany({
        where: {
          studentId: child.userId,
          dueDate: { gte: since, lte: until },
          isCompleted: false
        },
        orderBy: { dueDate: 'asc' }
      }),
      prisma.studySession.findMany({
        where: {
          studentId: child.userId,
          startTime: { gte: since, lte: until }
        },
        orderBy: { startTime: 'asc' }
      })
    ]);

    res.json({
      projects: projects.map(p => ({
        id: p.id,
        title: p.title,
        subject: p.subject,
        deadline: p.deadline,
        progress: p.tasks.filter(t => t.isCompleted).length / Math.max(p.tasks.length, 1)
      })),
      upcomingTasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        subject: t.subject,
        dueDate: t.dueDate,
        priority: 'MEDIUM'
      })),
      studyPlan: studySessions.map(s => ({
        date: s.startTime,
        subject: s.subject,
        duration: s.duration
      }))
    });
  } catch (error) {
    next(error);
  }
});

router.put('/settings', async (req, res, next) => {
  try {
    if (req.user.role !== 'PARENT') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { dailyLimitMinutes, allowedSubjects, notifications } = req.body;

    await prisma.parentProfile.update({
      where: { userId: req.user.id },
      data: {
        preferences: {
          dailyLimitMinutes,
          allowedSubjects,
          notifications
        }
      }
    });

    res.json({ message: 'Configuración actualizada' });
  } catch (error) {
    next(error);
  }
});

export default router;
