import { Router } from 'express';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { status, subject, projectId } = req.query;
    
    const where = { studentId: req.user.id };
    if (status === 'completed') where.isCompleted = true;
    if (status === 'pending') where.isCompleted = false;
    if (subject) where.subject = subject;
    if (projectId) where.projectId = projectId;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: { select: { id: true, title: true } },
        subtasks: true,
        _count: { select: { pomodoros: true } }
      },
      orderBy: [{ isCompleted: 'asc' }, { dueDate: 'asc' }]
    });

    res.json({ tasks });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, subject, estimatedMinutes, dueDate, difficulty, projectId, subtasks } = req.body;

    const task = await prisma.task.create({
      data: {
        studentId: req.user.id,
        title,
        description,
        subject,
        estimatedMinutes: estimatedMinutes || 30,
        dueDate: dueDate ? new Date(dueDate) : null,
        difficulty: difficulty || 3,
        projectId,
        subtasks: subtasks ? {
          create: subtasks.map(s => ({ title: s.title, isCompleted: false }))
        } : undefined
      },
      include: { subtasks: true }
    });

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
});

router.post('/generate-plan', async (req, res, next) => {
  try {
    const { projectTitle, subject, deadline, totalEstimatedHours } = req.body;
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate - now) / (24 * 60 * 60 * 1000));
    const dailyMinutes = Math.round((totalEstimatedHours * 60) / Math.max(daysUntilDeadline, 1));

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    const subtasks = generateSubtasks(projectTitle, subject, dailyMinutes, daysUntilDeadline);

    const project = await prisma.project.create({
      data: {
        studentId: req.user.id,
        title: projectTitle,
        subject,
        deadline: deadlineDate,
        tasks: {
          create: subtasks
        }
      },
      include: {
        tasks: {
          include: { subtasks: true }
        }
      }
    });

    res.json({ 
      message: 'Plan generado exitosamente',
      project,
      suggestion: `Te recomiendo ${daysUntilDeadline > 7 ? '2-3' : '4-5'} sesiones de ${Math.round(dailyMinutes)} minutos diarias`
    });
  } catch (error) {
    next(error);
  }
});

function generateSubtasks(title, subject, dailyMinutes, days) {
  const taskTemplates = [
    { title: `Investigar sobre ${title}`, difficulty: 4, minutes: Math.round(dailyMinutes * 0.2) },
    { title: `Tomar apuntes de conceptos clave`, difficulty: 3, minutes: Math.round(dailyMinutes * 0.25) },
    { title: `Resolver ejercicios prácticos`, difficulty: 4, minutes: Math.round(dailyMinutes * 0.3) },
    { title: `Repasar y consolidar`, difficulty: 2, minutes: Math.round(dailyMinutes * 0.15) },
    { title: `Realizar auto-evaluación`, difficulty: 3, minutes: Math.round(dailyMinutes * 0.1) }
  ];

  const tasks = [];
  const tasksPerDay = Math.min(3, Math.ceil(taskTemplates.length / Math.max(Math.ceil(days / 2), 1)));
  
  for (let day = 0; day < Math.min(days, 5); day++) {
    for (let i = 0; i < tasksPerDay && (day * tasksPerDay + i) < taskTemplates.length; i++) {
      const template = taskTemplates[day * tasksPerDay + i];
      if (template) {
        tasks.push({
          title: `${template.title} (Día ${day + 1})`,
          difficulty: template.difficulty,
          estimatedMinutes: template.minutes,
          subject,
          subtasks: [
            { title: 'Preparar materiales', isCompleted: false },
            { title: 'Ejecutar tarea', isCompleted: false },
            { title: 'Revisar resultados', isCompleted: false }
          ]
        });
      }
    }
  }

  return tasks;
}

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted, estimatedMinutes, dueDate } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (estimatedMinutes) updateData.estimatedMinutes = estimatedMinutes;
    if (dueDate) updateData.dueDate = new Date(dueDate);
    
    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted;
      updateData.completedAt = isCompleted ? new Date() : null;
      
      if (isCompleted) {
        await prisma.studentProfile.update({
          where: { userId: req.user.id },
          data: { 
            totalXP: { increment: 10 },
            currentStreak: { increment: 1 }
          }
        });
      }
    }

    const task = await prisma.task.update({
      where: { id, studentId: req.user.id },
      data: updateData,
      include: { subtasks: true }
    });

    res.json({ task });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.task.delete({
      where: { id: req.params.id, studentId: req.user.id }
    });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    next(error);
  }
});

export default router;
