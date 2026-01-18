import { Router } from 'express';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import prisma from '../config/database.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    const { subject } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Archivo requerido' });
    }

    const contentUpload = await prisma.contentUpload.create({
      data: {
        studentId: req.user.id,
        fileUrl: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        fileType: file.mimetype.startsWith('image') ? 'IMAGE' : 'PDF',
        subject
      }
    });

    res.json({ 
      upload: contentUpload,
      status: 'processing'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/process/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const upload = await prisma.contentUpload.findUnique({
      where: { id }
    });

    if (!upload || upload.studentId !== req.user.id) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    let summary;
    try {
      if (upload.fileType === 'IMAGE') {
        const { data: { text } } = await Tesseract.recognize(
          upload.fileUrl,
          'es',
          { logger: m => console.log(m) }
        );
        summary = generateSummaryFromText(text, upload.subject);
      } else {
        summary = {
          type: 'PDF',
          message: 'Procesamiento de PDF configurado',
          sections: ['Sección 1: Introducción', 'Sección 2: Desarrollo', 'Sección 3: Conclusiones'],
          keyConcepts: ['Concepto 1', 'Concepto 2', 'Concepto 3']
        };
      }

      await prisma.contentUpload.update({
        where: { id },
        data: { processed: true, summary }
      });
    } catch (ocrError) {
      console.error('OCR Error:', ocrError);
      summary = {
        type: 'text_extraction',
        message: 'No se pudo procesar el texto automáticamente',
        manualSummary: true
      };
    }

    res.json({ 
      upload: { ...upload, summary },
      processed: true
    });
  } catch (error) {
    next(error);
  }
});

function generateSummaryFromText(text, subject) {
  const lines = text.split('\n').filter(line => line.trim().length > 10);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  const keyConcepts = sentences
    .slice(0, Math.min(5, sentences.length))
    .map(s => s.trim().substring(0, 100));

  const sections = lines.slice(0, Math.min(6, lines.length)).map(l => l.substring(0, 80));

  return {
    type: 'text_analysis',
    originalLength: text.length,
    summaryLength: sentences.slice(0, 3).join('. '),
    keyConcepts,
    sections,
    mindMap: generateMindMapStructure(keyConcepts),
    flashcards: generateFlashcards(keyConcepts, subject)
  };
}

function generateMindMapStructure(concepts) {
  return concepts.map((concept, index) => ({
    id: index + 1,
    topic: concept,
    related: []
  }));
}

function generateFlashcards(concepts, subject) {
  return concepts.map((concept, index) => ({
    id: index + 1,
    question: `¿Qué sabes sobre "${concept}" en ${subject}?`,
    answer: 'Completa la respuesta basándote en tus apuntes',
    topic: subject
  }));
}

router.get('/:id', async (req, res, next) => {
  try {
    const upload = await prisma.contentUpload.findUnique({
      where: { id: req.params.id }
    });

    if (!upload || upload.studentId !== req.user.id) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    res.json({ upload });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const uploads = await prisma.contentUpload.findMany({
      where: { studentId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ uploads });
  } catch (error) {
    next(error);
  }
});

export default router;
