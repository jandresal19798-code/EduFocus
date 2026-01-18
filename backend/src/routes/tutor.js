import { Router } from 'express';
import prisma from '../config/database.js';
import TutorService from '../services/tutorService.js';

const router = Router();

router.get('/conversations', async (req, res, next) => {
  try {
    const conversations = await prisma.tutorConversation.findMany({
      where: { studentId: req.user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ conversations });
  } catch (error) {
    next(error);
  }
});

router.post('/conversations', async (req, res, next) => {
  try {
    const { subject, topic, initialMessage } = req.body;

    const conversation = await prisma.tutorConversation.create({
      data: {
        studentId: req.user.id,
        subject,
        topic,
        messages: {
          create: {
            role: 'USER',
            content: initialMessage
          }
        }
      },
      include: { messages: true }
    });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    const tutorService = new TutorService(profile?.ageGroup || 'TEENAGER');
    const response = await tutorService.generateResponse(initialMessage, { subject, topic });

    await prisma.tutorMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'TUTOR',
        content: response.reply
      }
    });

    res.status(201).json({ 
      conversation,
      tutorResponse: response.reply,
      nextQuestion: response.nextQuestion
    });
  } catch (error) {
    next(error);
  }
});

router.post('/conversations/:id/message', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const conversation = await prisma.tutorConversation.findUnique({
      where: { id }
    });

    if (!conversation || conversation.studentId !== req.user.id) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    await prisma.tutorMessage.create({
      data: {
        conversationId: id,
        role: 'USER',
        content
      }
    });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    const tutorService = new TutorService(profile?.ageGroup || 'TEENAGER');
    const response = await tutorService.generateResponse(content, {
      subject: conversation.subject,
      topic: conversation.topic,
      conversationId: id
    });

    await prisma.tutorMessage.create({
      data: {
        conversationId: id,
        role: 'TUTOR',
        content: response.reply
      }
    });

    res.json({
      reply: response.reply,
      nextQuestion: response.nextQuestion,
      conversationId: id
    });
  } catch (error) {
    next(error);
  }
});

router.get('/hint/:subject', async (req, res, next) => {
  try {
    const { subject } = req.params;
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    const tutorService = new TutorService(profile?.ageGroup || 'TEENAGER');
    const hint = tutorService.generateHint('help', { subject });

    res.json({ hint });
  } catch (error) {
    next(error);
  }
});

router.post('/check-answer', async (req, res, next) => {
  try {
    const { question, userAnswer, correctAnswer, subject } = req.body;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    const tutorService = new TutorService(profile?.ageGroup || 'TEENAGER');
    
    let feedback;
    if (userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
      feedback = tutorService.ageGroup === 'CHILD' 
        ? '¡Eso es correcto! 🎉 ¡Muy bien!'
        : '¡Correcto! Buen trabajo.';
    } else {
      const hint = tutorService.generateHint('wrong', { subject });
      feedback = `${tutorService.ageGroup === 'CHILD' ? 'Casi lo tienes...' : 'No es correcto.'} ${hint}`;
    }

    res.json({
      correct: userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim(),
      feedback,
      correctAnswer: userAnswer.toLowerCase().trim() !== correctAnswer.toLowerCase().trim() ? correctAnswer : null
    });
  } catch (error) {
    next(error);
  }
});

export default router;
