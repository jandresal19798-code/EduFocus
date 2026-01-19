import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tasks = [
  // ============================================
  // NIVEL PRIMARIO (6-9 años)
  // ============================================
  
  // Matemática - Nivel Primario
  {
    title: "Juego de La Tienda",
    description: "Poner precio a objetos de casa y realizar operaciones de suma y resta simulando compras con billetes de papel.",
    subject: "Matemática",
    estimatedMinutes: 45,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Operaciones básicas",
    subtasks: [
      { title: "Reunir objetos y asignar precios", isCompleted: false },
      { title: "Crear billetes de papel", isCompleted: false },
      { title: "Jugar a comprar y vender", isCompleted: false },
      { title: "Registrar las operaciones", isCompleted: false }
    ]
  },
  
  // Lengua Española - Nivel Primario
  {
    title: "Final alternativo de cuento favorito",
    description: "Inventar y dibujar un final diferente para el cuento favorito.",
    subject: "Lengua Española",
    estimatedMinutes: 40,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Creatividad y escritura",
    subtasks: [
      { title: "Elegir el cuento favorito", isCompleted: false },
      { title: "Pensar un nuevo final", isCompleted: false },
      { title: "Escribir el final alternativo", isCompleted: false },
      { title: "Dibujar la escena", isCompleted: false }
    ]
  },
  {
    title: "Lectura en voz alta de trabalenguas",
    description: "Practicar la lectura en voz alta de trabalenguas para mejorar la dicción.",
    subject: "Lengua Española",
    estimatedMinutes: 20,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Dicción y pronunciación",
    subtasks: [
      { title: "Buscar trabalenguas online", isCompleted: false },
      { title: "Practicar lentamente", isCompleted: false },
      { title: "Aumentar velocidad gradualmente", isCompleted: false },
      { title: "Grabar la lectura", isCompleted: false }
    ]
  },
  
  // Geografía - Nivel Primario
  {
    title: "Plano de mi habitación con rosa de los vientos",
    description: "Dibujar un plano de la habitación propia incluyendo una rosa de los vientos (Norte, Sur, Este, Oeste).",
    subject: "Geografía",
    estimatedMinutes: 35,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Orientación espacial",
    subtasks: [
      { title: "Medir la habitación", isCompleted: false },
      { title: "Dibujar el plano a escala", isCompleted: false },
      { title: "Agregar rosa de los vientos", isCompleted: false },
      { title: "Señalar dónde está tu cama respecto al Norte", isCompleted: false }
    ]
  },
  
  // Historia - Nivel Primario
  {
    title: "Entrevista a un abuelo sobre su escuela",
    description: "Entrevistar a un familiar mayor sobre cómo era su escuela y qué juegos jugaban.",
    subject: "Historia",
    estimatedMinutes: 50,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Historia familiar y escolar",
    subtasks: [
      { title: "Preparar preguntas para la entrevista", isCompleted: false },
      { title: "Realizar la entrevista", isCompleted: false },
      { title: "Escribir un resumen de lo aprendido", isCompleted: false },
      { title: "Dibujar la escuela del abuelo", isCompleted: false }
    ]
  },
  
  // Ciencias (Física/Química) - Nivel Primario
  {
    title: "Experimento: Flota o se hunde",
    description: "Probar diferentes objetos en agua y registrar qué sucede. Introducir concepto de densidad de forma simple.",
    subject: "Ciencias",
    estimatedMinutes: 40,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Densidad y flotación",
    subtasks: [
      { title: "Reunir objetos para probar (madera, piedra,塑料)", isCompleted: false },
      { title: "Predecir qué flotará y qué se hundirá", isCompleted: false },
      { title: "Probar en agua y registrar resultados", isCompleted: false },
      { title: "Dibujar y explicar por qué algunos flotan", isCompleted: false }
    ]
  },

  // ============================================
  // NIVEL MEDIA BÁSICA (10-13 años)
  // ============================================
  
  // Matemática - Nivel Media Básica
  {
    title: "Problemas de fracciones con recetas",
    description: "Resolver problemas con fracciones y porcentajes aplicados a recetas de cocina.",
    subject: "Matemática",
    estimatedMinutes: 50,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Fracciones y porcentajes",
    subtasks: [
      { title: "Seleccionar una receta para 4 personas", isCompleted: false },
      { title: "Calcular cantidades para 10 personas", isCompleted: false },
      { title: "Calcular el costo total de ingredientes", isCompleted: false },
      { title: "Resolver variaciones de porciones", isCompleted: false }
    ]
  },
  
  // Historia - Nivel Media Básica
  {
    title: "Línea del tiempo de civilizaciones antiguas",
    description: "Crear una línea del tiempo visual sobre civilizaciones antiguas (Egipto, Grecia o Roma).",
    subject: "Historia",
    estimatedMinutes: 60,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Civilizaciones antiguas",
    subtasks: [
      { title: "Investigar fechas clave de la civilización elegida", isCompleted: false },
      { title: "Identificar un invento que seguimos usando", isCompleted: false },
      { title: "Diseñar la línea del tiempo visual", isCompleted: false },
      { title: "Agregar imágenes y descripciones", isCompleted: false }
    ]
  },
  
  // Geografía - Nivel Media Básica
  {
    title: "Diagrama del ciclo del agua",
    description: "Investigar y explicar el ciclo del agua a través de un diagrama etiquetado.",
    subject: "Geografía",
    estimatedMinutes: 45,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Ciclo del agua y clima",
    subtasks: [
      { title: "Investigar las etapas del ciclo del agua", isCompleted: false },
      { title: "Relacionar con el clima de tu región", isCompleted: false },
      { title: "Crear diagrama etiquetado", isCompleted: false },
      { title: "Explicar cada etapa con ejemplos", isCompleted: false }
    ]
  },
  
  // Literatura - Nivel Media Básica
  {
    title: "Leyenda local en historieta",
    description: "Leer una leyenda local y transformarla en guion de historieta.",
    subject: "Literatura",
    estimatedMinutes: 55,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Literatura y gramática",
    subtasks: [
      { title: "Investigar una leyenda de tu región", isCompleted: false },
      { title: "Identificar sujeto y predicado en diálogos", isCompleted: false },
      { title: "Crear guion de historieta", isCompleted: false },
      { title: "Dibujar viñetas", isCompleted: false }
    ]
  },
  
  // Física - Nivel Media Básica
  {
    title: "Experimento de circuitos simples",
    description: "Construir un circuito eléctrico simple con pila, cables y bombilla.",
    subject: "Física",
    estimatedMinutes: 50,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Electricidad básica",
    subtasks: [
      { title: "Reunir materiales (pila, cables, bombilla)", isCompleted: false },
      { title: "Dibujar el circuito antes de construir", isCompleted: false },
      { title: "Armar el circuito", isCompleted: false },
      { title: "Explicar el flujo de corriente eléctrica", isCompleted: false }
    ]
  },
  
  // Química - Nivel Media Básica
  {
    title: "Cambios físicos vs químicos en la cocina",
    description: "Identificar cambios físicos y químicos en la cocina (azúcar derritiéndose vs papel quemándose).",
    subject: "Química",
    estimatedMinutes: 40,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Cambios de la materia",
    subtasks: [
      { title: "Observar ejemplos de cambios físicos", isCompleted: false },
      { title: "Observar ejemplos de cambios químicos", isCompleted: false },
      { title: "Clasificar y explicar cada cambio", isCompleted: false },
      { title: "Crear tabla comparativa", isCompleted: false }
    ]
  },

  // ============================================
  // NIVEL MEDIA SUPERIOR (14-16 años)
  // ============================================
  
  // Matemática - Nivel Media Superior
  {
    title: "Modelado matemático: Crecimiento bacteriano",
    description: "Modelar el crecimiento de una población bacteriana usando ecuaciones lineales o exponenciales.",
    subject: "Matemática",
    estimatedMinutes: 70,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Álgebra y funciones",
    subtasks: [
      { title: "Investigar sobre crecimiento bacteriano", isCompleted: false },
      { title: "Modelar con ecuaciones exponenciales", isCompleted: false },
      { title: "Crear gráfica de crecimiento", isCompleted: false },
      { title: "Resolver problemas de aplicación", isCompleted: false }
    ]
  },
  
  // Física - Nivel Media Superior
  {
    title: "Experimento de caída libre",
    description: "Medir caída libre con cronómetro y calcular aceleración de la gravedad.",
    subject: "Física",
    estimatedMinutes: 60,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Cinemática y gravedad",
    subtasks: [
      { title: "Preparar materiales (pelota, cronómetro)", isCompleted: false },
      { title: "Medir tiempo de caída desde diferentes alturas", isCompleted: false },
      { title: "Calcular g usando las fórmulas", isCompleted: false },
      { title: "Comparar con g=9.8 m/s²", isCompleted: false }
    ]
  },
  
  // Química - Nivel Media Superior
  {
    title: "Modelos moleculares de compuestos orgánicos",
    description: "Construir modelos de estructuras moleculares (metano, agua) y explicar enlaces químicos.",
    subject: "Química",
    estimatedMinutes: 55,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Estructura atómica y enlaces",
    subtasks: [
      { title: "Investigar estructura de compuestos simples", isCompleted: false },
      { title: "Crear modelos con materiales caseros", isCompleted: false },
      { title: "Explicar tipos de enlaces químicos", isCompleted: false },
      { title: "Presentar los modelos con explicación", isCompleted: false }
    ]
  },
  
  // Historia - Nivel Media Superior
  {
    title: "Ensayo: Primera vs Segunda Guerra Mundial",
    description: "Comparar causas de WWI y WWII y analizar impacto en la geopolítica actual.",
    subject: "Historia",
    estimatedMinutes: 90,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Guerras mundiales y geopolítica",
    subtasks: [
      { title: "Investigar causas de WWI", isCompleted: false },
      { title: "Investigar causas de WWII", isCompleted: false },
      { title: "Analizar impacto en Río de la Plata y mundo", isCompleted: false },
      { title: "Escribir ensayo comparativo", isCompleted: false }
    ]
  },
  
  // Geografía - Nivel Media Superior
  {
    title: "Estudio de caso: Cambio climático",
    description: "Analizar mapas satelitales de deforestación o retroceso de glaciares.",
    subject: "Geografía",
    estimatedMinutes: 75,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Cambio climático",
    subtasks: [
      { title: "Investigar sobre cambio climático", isCompleted: false },
      { title: "Comparar imágenes satelitales (antes vs ahora)", isCompleted: false },
      { title: "Analizar datos de deforestación/glaciares", isCompleted: false },
      { title: "Redactar informe con conclusiones", isCompleted: false }
    ]
  },
  
  // Literatura - Nivel Media Superior
  {
    title: "Análisis crítico del Boom Latinoamericano",
    description: "Analizar una obra del Boom identificando figuras retóricas y contexto socio-político.",
    subject: "Literatura",
    estimatedMinutes: 80,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Literatura latinoamericana",
    subtasks: [
      { title: "Investigar sobre el Boom Latinoamericano", isCompleted: false },
      { title: "Seleccionar obra de García Márquez, Cortázar o Vargas Llosa", isCompleted: false },
      { title: "Identificar figuras retóricas en el texto", isCompleted: false },
      { title: "Analizar contexto socio-político del autor", isCompleted: false }
    ]
  }
];

async function seedTasks() {
  console.log('🌱 Iniciando seed de tareas educativas...\n');

  try {
    // Get a test user to assign tasks to
    const user = await prisma.user.findFirst({
      where: { role: 'STUDENT' }
    });

    if (!user) {
      console.log('❌ No hay usuarios registrados. Por favor regístrate primero.');
      return;
    }

    console.log(`✅ Usuario encontrado: ${user.email}\n`);

    let created = 0;
    let skipped = 0;

    for (const taskData of tasks) {
      // Check if task already exists
      const existing = await prisma.task.findFirst({
        where: {
          title: taskData.title,
          studentId: user.id
        }
      });

      if (existing) {
        console.log(`⏭️  Saltando: ${taskData.title}`);
        skipped++;
        continue;
      }

      // Create the task
      const task = await prisma.task.create({
        data: {
          studentId: user.id,
          title: taskData.title,
          description: taskData.description,
          subject: taskData.subject,
          estimatedMinutes: taskData.estimatedMinutes,
          difficulty: taskData.difficulty,
          topic: taskData.topic,
          subtasks: {
            create: taskData.subtasks
          }
        },
        include: {
          subtasks: true
        }
      });

      console.log(`✅ Creado: ${taskData.subject} - ${taskData.title}`);
      created++;
    }

    console.log(`\n🎉 Seed completado!`);
    console.log(`   Tareas creadas: ${created}`);
    console.log(`   Tareas saltadas (ya existían): ${skipped}`);
    console.log(`   Total: ${tasks.length} tareas disponibles`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
seedTasks();

export default seedTasks;
