export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

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
      error: 'El recurso ya existe'
    });
  }

  return res.status(500).json({
    error: 'Error interno del servidor'
  });
}
