import { Router } from 'express';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/profile', async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuario no autorizado' });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        badges: true,
        user: { select: { email: true } }
      }
    }).catch(function(err) {
      console.error('Error finding student profile:', err);
      return null;
    });

    if (!profile) {
      const parentProfile = await prisma.parentProfile.findUnique({
        where: { userId: req.user.id },
        include: {
          user: { select: { email: true } }
        }
      }).catch(function(err) {
        console.error('Error finding parent profile:', err);
        return null;
      });

      if (!parentProfile) {
        // Return basic info even without profile
        return res.json({ 
          profile: {
            displayName: req.user.email ? req.user.email.split('@')[0] : 'Usuario',
            userId: req.user.id,
            ageGroup: 'TEENAGER',
            totalXP: 0,
            level: 1,
            currentStreak: 0
          }, 
          role: req.user.role || 'STUDENT'
        });
      }
      return res.json({ profile: parentProfile, role: 'PARENT' });
    }

    res.json({ profile, role: 'STUDENT' });
  } catch (error) {
    console.error('Profile error:', error);
    next(error);
  }
});

router.put('/profile', async (req, res, next) => {
  try {
    const { displayName, avatarUrl, preferences, ageGroup } = req.body;

    const updated = await prisma.studentProfile.update({
      where: { userId: req.user.id },
      data: {
        displayName,
        avatarUrl,
        preferences,
        ...(ageGroup && { ageGroup })
      }
    });

    res.json({ profile: updated });
  } catch (error) {
    next(error);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [tasksCompleted, weekSessions, monthProgress, levelProgress] = await Promise.all([
      prisma.task.count({ where: { studentId: req.user.id, isCompleted: true } }),
      prisma.studySession.count({
        where: { studentId: req.user.id, startTime: { gte: weekAgo } }
      }),
      prisma.progressRecord.findMany({
        where: { 
          studentId: req.user.id,
          recordedAt: { gte: monthAgo }
        },
        orderBy: { recordedAt: 'desc' },
        take: 30
      }),
      prisma.studentProfile.findUnique({
        where: { userId: req.user.id },
        select: { totalXP: true, level: true, currentStreak: true }
      })
    ]);

    const totalMinutes = monthProgress.reduce((acc, r) => acc + r.timeSpent, 0);
    const subjectsMastery = monthProgress.reduce((acc, r) => {
      if (!acc[r.subject]) {
        acc[r.subject] = { total: 0, count: 0, mastery: 0 };
      }
      acc[r.subject].total += r.masteryLevel;
      acc[r.subject].count += 1;
      return acc;
    }, {});

    const subjectsStats = Object.entries(subjectsMastery).map(([subject, data]) => ({
      subject,
      averageMastery: Math.round(data.total / data.count)
    }));

    const xpForNextLevel = levelProgress.level * 500;
    const xpProgress = Math.round((levelProgress.totalXP % 500) / 500 * 100);

    res.json({
      tasksCompleted,
      weekSessions,
      totalMinutesThisMonth: totalMinutes,
      subjectsMastery: subjectsStats,
      gamification: {
        level: levelProgress.level,
        currentXP: levelProgress.totalXP,
        xpForNextLevel,
        xpProgress,
        streak: levelProgress.currentStreak
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
