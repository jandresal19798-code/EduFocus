export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err, req, res, next) {
  console.error('========== ERROR ==========');
  console.error('Message:', err.message);
  console.error('Code:', err.code);
  console.error('Name:', err.name);
  console.error('Stack:', err.stack);
  console.error('============================');

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.message
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'El recurso ya existe',
      hint: 'Este email ya está registrado. Usa otro email.'
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro no encontrado'
    });
  }

  return res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message,
    type: err.name || 'Unknown'
  });
}
