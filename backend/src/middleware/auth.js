import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'edufocus-secret-key-change-in-production';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

export function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      ageGroup: user.ageGroup 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}
