import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { generateToken, generateRefreshToken } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, birthDate, role, parentId, ageGroup, parentalConsent } = req.body;

    if (!email || !password || !birthDate) {
      throw new AppError('Email, contraseña y fecha de nacimiento son requeridos', 400);
    }

    // Try to connect to database
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      return res.status(503).json({
        error: 'Database unavailable',
        message: 'La base de datos no está disponible. Verifica que DATABASE_URL esté configurado correctamente.',
        hint: 'Asegúrate de que tu PostgreSQL en Render esté activo y la conexión sea correcta.'
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('El email ya está registrado', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const birth = new Date(birthDate);
    
    if (isNaN(birth.getTime())) {
      throw new AppError('Fecha de nacimiento inválida', 400);
    }
    
    const age = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    if (role === 'STUDENT') {
      if (age < 8 || age > 18) {
        throw new AppError('La edad debe estar entre 8 y 18 años', 400);
      }
      if (age < 13 && parentalConsent !== true) {
        throw new AppError('Para menores de 13 años se requiere consentimiento parental', 400);
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        birthDate: birth,
        role: role || 'STUDENT',
        parentalConsent: age < 13 ? parentalConsent === true : true,
        parentId: role === 'STUDENT' ? parentId : null
      }
    });

    // Try to create profile, but don't fail if it doesn't work
    var displayName = email.split('@')[0];
    
    try {
      if (role === 'STUDENT') {
        const determinedAgeGroup = age < 13 ? 'CHILD' : 'TEENAGER';
        await prisma.studentProfile.create({
          data: {
            userId: user.id,
            ageGroup: ageGroup || determinedAgeGroup,
            displayName: displayName,
            preferences: {
              theme: 'system',
              pomodoroDuration: 25,
              notifications: true
            }
          }
        });
        console.log('Student profile created for user:', user.id);
      } else if (role === 'PARENT') {
        await prisma.parentProfile.create({
          data: {
            userId: user.id,
            displayName: displayName
          }
        });
        console.log('Parent profile created for user:', user.id);
      }
    } catch (profileErr) {
      console.warn('Could not create profile, continuing anyway:', profileErr.message);
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ageGroup: ageGroup || (age < 13 ? 'CHILD' : 'TEENAGER')
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email y contraseña son requeridos', 400);
    }

    // Try to connect to database
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      return res.status(503).json({
        error: 'Database unavailable',
        message: 'La base de datos no está disponible.'
      });
    }

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Only update student profile, not parent
    if (user.role === 'STUDENT') {
      await prisma.studentProfile.update({
        where: { userId: user.id },
        data: { lastActiveAt: new Date() }
      }).catch(function(err) {
        console.error('Error updating lastActiveAt:', err);
      });
    }

    res.json({
      message: 'Login exitoso',
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ageGroup: user.profile?.ageGroup || 'TEENAGER',
        displayName: user.profile?.displayName
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const jwt = await import('jsonwebtoken');
    
    const decoded = jwt.default.verify(refreshToken, process.env.JWT_SECRET || 'edufocus-secret-key-change-in-production');
    
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      return res.status(503).json({
        error: 'Database unavailable',
        message: 'La base de datos no está disponible.'
      });
    }
    
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const newToken = generateToken(user);
    res.json({ token: newToken });
  } catch (error) {
    next(error);
  }
});

export default router;
