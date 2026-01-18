import { Router } from 'express';
import prisma from '../config/database.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { days = 30, subject } = req.query;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const where = {
      studentId: req.user.id,
      recordedAt: { gte: since }
    };
    if (subject) where.subject = subject;

    const records = await prisma.progressRecord.findMany({
      where,
      orderBy: { recordedAt: 'desc' }
    });

    const subjectStats = records.reduce((acc, record) => {
      if (!acc[record.subject]) {
        acc[record.subject] = {
          topics: {},
          totalTime: 0,
          avgMastery: 0,
          count: 0
        };
      }
      
      if (!acc[record.subject].topics[record.topic]) {
        acc[record.subject].topics[record.topic] = {
          mastery: [],
          timeSpent: 0
        };
      }
      
      acc[record.subject].topics[record.topic].mastery.push(record.masteryLevel);
      acc[record.subject].topics[record.topic].timeSpent += record.timeSpent;
      acc[record.subject].totalTime += record.timeSpent;
      acc[record.subject].count += 1;

      return acc;
    }, {});

    const subjects = Object.entries(subjectStats).map(([subject, data]) => ({
      name: subject,
      totalTime: data.totalTime,
      avgMastery: Math.round(
        Object.values(data.topics).reduce((sum, t) => sum + (t.mastery.reduce((a, b) => a + b, 0) / t.mastery.length), 0) / 
        Object.keys(data.topics).length
      ),
      topics: Object.entries(data.topics).map(([topic, t]) => ({
        name: topic,
        avgMastery: Math.round(t.mastery.reduce((a, b) => a + b, 0) / t.mastery.length),
        timeSpent: t.timeSpent
      }))
    }));

    res.json({ 
      records: records.slice(0, 50),
      subjects,
      summary: {
        totalTime: records.reduce((sum, r) => sum + r.timeSpent, 0),
        avgMastery: Math.round(records.reduce((sum, r) => sum + r.masteryLevel, 0) / Math.max(records.length, 1))
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/record', async (req, res, next) => {
  try {
    const { subject, topic, masteryLevel, timeSpent, attempts, score } = req.body;

    const record = await prisma.progressRecord.create({
      data: {
        studentId: req.user.id,
        subject,
        topic,
        masteryLevel: Math.min(100, Math.max(0, masteryLevel)),
        timeSpent,
        attempts: attempts || 1,
        score
      }
    });

    if (masteryLevel >= 80 && attempts === 1) {
      await prisma.studentProfile.update({
        where: { userId: req.user.id },
        data: { totalXP: { increment: 25 } }
      });
    }

    res.status(201).json({ record });
  } catch (error) {
    next(error);
  }
});

router.get('/subjects', async (req, res, next) => {
  try {
    const records = await prisma.progressRecord.findMany({
      where: { studentId: req.user.id },
      select: { subject: true }
    });

    const subjects = [...new Set(records.map(r => r.subject))];
    res.json({ subjects });
  } catch (error) {
    next(error);
  }
});

router.get('/weekly', async (req, res, next) => {
  try {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const records = await prisma.progressRecord.findMany({
        where: {
          studentId: req.user.id,
          recordedAt: { gte: date, lt: nextDate }
        }
      });

      weekData.push({
        date: date.toISOString().split('T')[0],
        totalTime: records.reduce((sum, r) => sum + r.timeSpent, 0),
        avgMastery: records.length > 0 
          ? Math.round(records.reduce((sum, r) => sum + r.masteryLevel, 0) / records.length)
          : 0
      });
    }

    res.json({ weekData });
  } catch (error) {
    next(error);
  }
});

export default router;
