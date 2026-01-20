import { Router } from 'express';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/profile', async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuario no autorizado' });
    }

    // Return basic profile data based on user info
    var baseProfile = {
      displayName: req.user.email ? req.user.email.split('@')[0] : 'Usuario',
      userId: req.user.id,
      email: req.user.email,
      ageGroup: req.user.role === 'PARENT' ? null : 'TEENAGER',
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      preferences: {
        theme: 'system',
        pomodoroDuration: 25,
        notifications: true
      }
    };

    // Try to get student profile
    try {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: req.user.id },
        include: {
          badges: true
        }
      });
      
      if (studentProfile) {
        return res.json({ 
          profile: {
            ...studentProfile,
            email: req.user.email
          }, 
          role: 'STUDENT' 
        });
      }
    } catch (e) {
      console.warn('Could not fetch student profile:', e.message);
    }

    // Try to get parent profile
    try {
      const parentProfile = await prisma.parentProfile.findUnique({
        where: { userId: req.user.id }
      });
      
      if (parentProfile) {
        return res.json({ 
          profile: {
            ...parentProfile,
            email: req.user.email
          }, 
          role: 'PARENT' 
        });
      }
    } catch (e) {
      console.warn('Could not fetch parent profile:', e.message);
    }

    // Return basic profile if no tables exist
    console.log('No profile found, returning basic profile for user:', req.user.id);
    res.json({ 
      profile: baseProfile, 
      role: req.user.role || 'STUDENT' 
    });

  } catch (error) {
    console.error('Profile error:', error);
    // Return basic data even on error
    res.json({
      profile: {
        displayName: req.user?.email ? req.user.email.split('@')[0] : 'Usuario',
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        preferences: {}
      },
      role: req.user?.role || 'STUDENT'
    });
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
