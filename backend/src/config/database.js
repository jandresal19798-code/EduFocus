import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a base de datos establecida');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  }
}
