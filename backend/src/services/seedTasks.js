import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tasks = [
  // ============================================
  // NIVEL PRIMARIO (6-9 años) | 40 Tareas
  // Foco: Observación, lectoescritura y operaciones básicas
  // ============================================
  
  // --- Matemática (6 tareas) ---
  {
    title: "Contar ventanas y puertas",
    description: "Contar cuántas ventanas y puertas hay en casa y representarlo en un gráfico de barras.",
    subject: "Matemática",
    estimatedMinutes: 30,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Conteo y gráficos",
    subtasks: [
      { title: "Recorrer la casa contando ventanas", isCompleted: false },
      { title: "Contar las puertas", isCompleted: false },
      { title: "Dibujar el gráfico de barras", isCompleted: false },
      { title: "Escribir los números encontrados", isCompleted: false }
    ]
  },
  {
    title: "Sumas con materiales",
    description: "Resolver 5 sumas usando legos o piedritas para visualizar el proceso.",
    subject: "Matemática",
    estimatedMinutes: 25,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Sumas básicas",
    subtasks: [
      { title: "Reunir legos o piedritas", isCompleted: false },
      { title: "Resolver suma 1: 3 + 4 =", isCompleted: false },
      { title: "Resolver suma 2: 5 + 2 =", isCompleted: false },
      { title: "Resolver suma 3: 6 + 3 =", isCompleted: false },
      { title: "Resolver suma 4: 2 + 7 =", isCompleted: false },
      { title: "Resolver suma 5: 4 + 4 =", isCompleted: false }
    ]
  },
  {
    title: "Medir la mesa",
    description: "Medir el largo de la mesa usando 'manos' (palmos) y luego con una regla.",
    subject: "Matemática",
    estimatedMinutes: 20,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Medición",
    subtasks: [
      { title: "Medir con palmos", isCompleted: false },
      { title: "Medir con regla en centímetros", isCompleted: false },
      { title: "Comparar ambos resultados", isCompleted: false }
    ]
  },
  {
    title: "Figuras geométricas en casa",
    description: "Identificar figuras geométricas (círculos, cuadrados, triángulos) en los envases de la cocina.",
    subject: "Matemática",
    estimatedMinutes: 25,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Figuras geométricas",
    subtasks: [
      { title: "Buscar objetos circulares", isCompleted: false },
      { title: "Buscar objetos cuadrados", isCompleted: false },
      { title: "Buscar objetos triangulares", isCompleted: false },
      { title: "Dibujar las figuras encontradas", isCompleted: false }
    ]
  },
  {
    title: "Serie numérica de 2 en 2",
    description: "Armar una serie numérica de 2 en 2 hasta el 100.",
    subject: "Matemática",
    estimatedMinutes: 30,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Series numéricas",
    subtasks: [
      { title: "Escribir del 0 al 20", isCompleted: false },
      { title: "Continuar del 20 al 40", isCompleted: false },
      { title: "Seguir del 40 al 60", isCompleted: false },
      { title: "Llegar hasta el 100", isCompleted: false }
    ]
  },
  {
    title: "Bingo de restas",
    description: "Armar un 'bingo' de restas simples para jugar en familia.",
    subject: "Matemática",
    estimatedMinutes: 40,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Restas básicas",
    subtasks: [
      { title: "Crear tarjetas con restas", isCompleted: false },
      { title: "Preparar los números para sorteos", isCompleted: false },
      { title: "Jugar con la familia", isCompleted: false }
    ]
  },

  // --- Lengua y Literatura (7 tareas) ---
  {
    title: "Palabras que riman",
    description: "Escribir una lista de 10 palabras que rimen con 'escuela'.",
    subject: "Lengua Española",
    estimatedMinutes: 15,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Rimas",
    subtasks: [
      { title: "Pensar en palabras que terminen igual que 'escuela'", isCompleted: false },
      { title: "Escribir 10 palabras", isCompleted: false }
    ]
  },
  {
    title: "Sustantivos en un cuento",
    description: "Leer un cuento corto y subrayar todos los sustantivos que encuentren.",
    subject: "Lengua Española",
    estimatedMinutes: 25,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Sustantivos",
    subtasks: [
      { title: "Leer el cuento", isCompleted: false },
      { title: "Identificar sustantivos (personas)", isCompleted: false },
      { title: "Identificar sustantivos (lugares)", isCompleted: false },
      { title: "Identificar sustantivos (cosas)", isCompleted: false }
    ]
  },
  {
    title: "Mi superhéroe",
    description: "Inventar un superhéroe y describir tres de sus poderes usando adjetivos.",
    subject: "Lengua Española",
    estimatedMinutes: 35,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Adjetivos y creatividad",
    subtasks: [
      { title: "Dibujar el superhéroe", isCompleted: false },
      { title: "Describir poder 1 con adjetivos", isCompleted: false },
      { title: "Describir poder 2 con adjetivos", isCompleted: false },
      { title: "Describir poder 3 con adjetivos", isCompleted: false }
    ]
  },
  {
    title: "Carta a un amigo",
    description: "Escribir una carta breve a un amigo contándole qué hizo el fin de semana.",
    subject: "Lengua Española",
    estimatedMinutes: 30,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Escritura",
    subtasks: [
      { title: "Recordar qué hice el fin de semana", isCompleted: false },
      { title: "Escribir el saludo", isCompleted: false },
      { title: "Escribir el cuerpo de la carta", isCompleted: false },
      { title: "Escribir la despedida", isCompleted: false }
    ]
  },
  {
    title: "Sílabas familiares",
    description: "Separar en sílabas los nombres de todos los integrantes de la familia.",
    subject: "Lengua Española",
    estimatedMinutes: 20,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Sílabas",
    subtasks: [
      { title: "Escribir nombres de la familia", isCompleted: false },
      { title: "Separar cada nombre en sílabas", isCompleted: false }
    ]
  },
  {
    title: "Abecedario ilustrado",
    description: "Crear un abecedario ilustrado con recortes de revistas.",
    subject: "Lengua Española",
    estimatedMinutes: 45,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Abecedario",
    subtasks: [
      { title: "Buscar letras en revistas", isCompleted: false },
      { title: "Recortar y pegar cada letra", isCompleted: false },
      { title: "Agregar una imagen para cada letra", isCompleted: false }
    ]
  },
  {
    title: "Trabalenguas en voz alta",
    description: "Practicar la lectura en voz alta de trabalenguas para mejorar la dicción.",
    subject: "Lengua Española",
    estimatedMinutes: 20,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Dicción",
    subtasks: [
      { title: "Buscar un trabalenguas", isCompleted: false },
      { title: "Practicar lentamente", isCompleted: false },
      { title: "Aumentar velocidad gradualmente", isCompleted: false },
      { title: "Grabar la lectura", isCompleted: false }
    ]
  },

  // --- Historia (4 tareas) ---
  {
    title: "Árbol genealógico",
    description: "Dibujar un árbol genealógico incluyendo hasta los bisabuelos.",
    subject: "Historia",
    estimatedMinutes: 40,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Familia",
    subtasks: [
      { title: "Entrevistar a padres sobre ancestros", isCompleted: false },
      { title: "Dibujar las generaciones", isCompleted: false },
      { title: "Escribir los nombres", isCompleted: false }
    ]
  },
  {
    title: "Mi barrio",
    description: "Hacer un dibujo de 'Mi barrio' destacando los lugares más importantes.",
    subject: "Historia",
    estimatedMinutes: 35,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Espacio local",
    subtasks: [
      { title: "Recordar lugares importantes", isCompleted: false },
      { title: "Dibujar el barrio", isCompleted: false },
      { title: "Señalar plaza, escuela, tienda", isCompleted: false }
    ]
  },
  {
    title: "Fotos antiguas vs nuevas",
    description: "Clasificar fotos antiguas y nuevas e identificar qué cambió en la vestimenta.",
    subject: "Historia",
    estimatedMinutes: 30,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Cambio histórico",
    subtasks: [
      { title: "Buscar fotos antiguas", isCompleted: false },
      { title: "Comparar con fotos actuales", isCompleted: false },
      { title: "Escribir 3 cambios observados", isCompleted: false }
    ]
  },
  {
    title: "Puntos cardinales",
    description: "Aprender los puntos cardinales y señalar por dónde sale el sol en casa.",
    subject: "Historia",
    estimatedMinutes: 25,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Orientación",
    subtasks: [
      { title: "Aprender: Norte, Sur, Este, Oeste", isCompleted: false },
      { title: "Observar por dónde sale el sol", isCompleted: false },
      { title: "Dibujar una rosa de los vientos", isCompleted: false }
    ]
  },

  // --- Ciencias (6 tareas) ---
  {
    title: "Agua y aceite",
    description: "Mezclar agua con aceite y observar por qué no se juntan.",
    subject: "Ciencias",
    estimatedMinutes: 20,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Densidad",
    subtasks: [
      { title: "Verter agua en un vaso", isCompleted: false },
      { title: "Agregar aceite", isCompleted: false },
      { title: "Observar y dibujar lo que sucede", isCompleted: false },
      { title: "Explicar por qué flotan separados", isCompleted: false }
    ]
  },
  {
    title: "Germinación del poroto",
    description: "Hacer germinar un poroto en algodón y registrar su crecimiento diario.",
    subject: "Ciencias",
    estimatedMinutes: 30,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Plantas",
    subtasks: [
      { title: "Colocar algodón en un frasco", isCompleted: false },
      { title: "Poner el poroto húmedo", isCompleted: false },
      { title: "Día 1: Dibujar el poroto", isCompleted: false },
      { title: "Día 3: Observar cambios", isCompleted: false },
      { title: "Día 7: Registrar crecimiento", isCompleted: false }
    ]
  },
  {
    title: "Buscar imanes en casa",
    description: "Buscar objetos con imanes en la casa y ver qué materiales atraen.",
    subject: "Ciencias",
    estimatedMinutes: 25,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Magnetismo",
    subtasks: [
      { title: "Encontrar un imán", isCompleted: false },
      { title: "Probar con diferentes objetos", isCompleted: false },
      { title: "Dibujar qué atrae y qué no", isCompleted: false }
    ]
  },
  {
    title: "Clima del día",
    description: "Observar y registrar el clima durante 5 días consecutivos.",
    subject: "Ciencias",
    estimatedMinutes: 15,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Clima",
    subtasks: [
      { title: "Día 1: Sol, nubes, lluvia, frío", isCompleted: false },
      { title: "Día 2: Observar el cielo", isCompleted: false },
      { title: "Día 3: Registrar temperatura", isCompleted: false },
      { title: "Día 4 y 5: Continuar observación", isCompleted: false },
      { title: "Dibujar gráfico del clima", isCompleted: false }
    ]
  },
  {
    title: "Partes de una planta",
    description: "Observar una planta y dibujar sus partes: raíz, tallo, hoja, flor.",
    subject: "Ciencias",
    estimatedMinutes: 25,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Plantas",
    subtasks: [
      { title: "Encontrar una planta", isCompleted: false },
      { title: "Observar la raíz", isCompleted: false },
      { title: "Observar tallo y hojas", isCompleted: false },
      { title: "Dibujar y etiquetar", isCompleted: false }
    ]
  },
  {
    title: "Estados del agua",
    description: "Observar los tres estados del agua: hielo (sólido), agua (líquido), vapor (gaseoso).",
    subject: "Ciencias",
    estimatedMinutes: 30,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Estados de la materia",
    subtasks: [
      { title: "Observar hielo en freezer", isCompleted: false },
      { title: "Observar agua en vaso", isCompleted: false },
      { title: "Hervir agua y ver vapor", isCompleted: false },
      { title: "Dibujar los tres estados", isCompleted: false }
    ]
  },

  // --- Geografía (3 tareas) ---
  {
    title: "Maqueta montaña y río",
    description: "Crear una maqueta simple de una montaña y un río usando masa de sal.",
    subject: "Geografía",
    estimatedMinutes: 45,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Relieve",
    subtasks: [
      { title: "Preparar masa de sal", isCompleted: false },
      { title: "Modelar la montaña", isCompleted: false },
      { title: "Crear el río", isCompleted: false },
      { title: "Decorar con árboles", isCompleted: false }
    ]
  },
  {
    title: "Mi habitación",
    description: "Dibujar un plano de la habitación incluyendo rosa de los vientos.",
    subject: "Geografía",
    estimatedMinutes: 30,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Orientación espacial",
    subtasks: [
      { title: "Medir la habitación", isCompleted: false },
      { title: "Dibujar el plano", isCompleted: false },
      { title: "Agregar rosa de los vientos", isCompleted: false },
      { title: "Señalar dónde está la cama", isCompleted: false }
    ]
  },
  {
    title: "Tipos de vivienda",
    description: "Investigar y dibujar tres tipos de vivienda: casa, departamento, rancho.",
    subject: "Geografía",
    estimatedMinutes: 30,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Vivienda",
    subtasks: [
      { title: "Buscar imágenes de casas", isCompleted: false },
      { title: "Buscar imágenes de departamentos", isCompleted: false },
      { title: "Buscar imágenes de ranchos", isCompleted: false },
      { title: "Dibujar los tres tipos", isCompleted: false }
    ]
  },

  // --- Física (3 tareas) ---
  {
    title: "Cómo cae un objeto",
    description: "Observar cómo caen diferentes objetos y predecir cuál llegará primero.",
    subject: "Física",
    estimatedMinutes: 20,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Gravedad",
    subtasks: [
      { title: "Recolectar objetos", isCompleted: false },
      { title: "Predecir el orden de caída", isCompleted: false },
      { title: "Soltar objetos simultáneamente", isCompleted: false },
      { title: "Comparar predicciones con resultados", isCompleted: false }
    ]
  },
  {
    title: "Flota o se hunde",
    description: "Probar diferentes objetos en agua y registrar qué flota y qué se hunde.",
    subject: "Física",
    estimatedMinutes: 25,
    difficulty: 1,
    ageGroup: "CHILD",
    topic: "Densidad y flotación",
    subtasks: [
      { title: "Reunir objetos (madera, piedra, plástico)", isCompleted: false },
      { title: "Predecir qué flotará", isCompleted: false },
      { title: "Probar en agua", isCompleted: false },
      { title: "Registrar resultados", isCompleted: false }
    ]
  },
  {
    title: "Sombras durante el día",
    description: "Observar y medir cómo cambia la sombra de un objeto a diferentes horas.",
    subject: "Física",
    estimatedMinutes: 40,
    difficulty: 2,
    ageGroup: "CHILD",
    topic: "Luz y sombra",
    subtasks: [
      { title: "Colocar un palo vertical", isCompleted: false },
      { title: "Medir sombra a la mañana", isCompleted: false },
      { title: "Medir sombra al mediodía", isCompleted: false },
      { title: "Medir sombra a la tarde", isCompleted: false },
      { title: "Dibujar las tres sombras", isCompleted: false }
    ]
  },

  // ============================================
  // NIVEL MEDIA BÁSICA (10-13 años) | 40 Tareas
  // Foco: Análisis, gramática estructural y resolución de problemas
  // ============================================

  // --- Matemática (6 tareas) ---
  {
    title: "Perímetro y área",
    description: "Calcular el perímetro y el área del patio o de una habitación.",
    subject: "Matemática",
    estimatedMinutes: 40,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Geometría",
    subtasks: [
      { title: "Medir los lados del espacio", isCompleted: false },
      { title: "Calcular el perímetro", isCompleted: false },
      { title: "Calcular el área", isCompleted: false },
      { title: "Dibujar un esquema", isCompleted: false }
    ]
  },
  {
    title: "Ejercicios de fracciones",
    description: "Resolver una lista de ejercicios de fracciones (suma y resta de igual denominador).",
    subject: "Matemática",
    estimatedMinutes: 35,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Fracciones",
    subtasks: [
      { title: "Repasar suma de fracciones", isCompleted: false },
      { title: "Resolver 5 sumas", isCompleted: false },
      { title: "Repasar resta de fracciones", isCompleted: false },
      { title: "Resolver 5 restas", isCompleted: false }
    ]
  },
  {
    title: "Presupuesto para cumpleaños",
    description: "Crear un presupuesto para un cumpleaños imaginario con un límite de dinero.",
    subject: "Matemática",
    estimatedMinutes: 45,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Presupuesto",
    subtasks: [
      { title: "Definir límite de dinero", isCompleted: false },
      { title: "Listar gastos (comida, decorations)", isCompleted: false },
      { title: "Asignar precios", isCompleted: false },
      { title: "Calcular total y verificar", isCompleted: false }
    ]
  },
  {
    title: "Ángulos en casa",
    description: "Identificar ángulos (recto, agudo, obtuso) en la arquitectura de la casa.",
    subject: "Matemática",
    estimatedMinutes: 30,
    difficulty: 2,
    ageGroup: "TEENAGER",
    topic: "Ángulos",
    subtasks: [
      { title: "Definir tipos de ángulos", isCompleted: false },
      { title: "Buscar 2 ángulos rectos", isCompleted: false },
      { title: "Buscar 2 ángulos agudos", isCompleted: false },
      { title: "Buscar 2 ángulos obtusos", isCompleted: false },
      { title: "Dibujar y señalar", isCompleted: false }
    ]
  },
  {
    title: "Encuesta y porcentajes",
    description: "Realizar una encuesta a 10 personas sobre su comida favorita y calcular porcentajes.",
    subject: "Matemática",
    estimatedMinutes: 40,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Estadística",
    subtasks: [
      { title: "Crear preguntas de encuesta", isCompleted: false },
      { title: "Entrevistar 10 personas", isCompleted: false },
      { title: "Calcular porcentajes", isCompleted: false },
      { title: "Crear gráfico de barras", isCompleted: false }
    ]
  },
  {
    title: "Proporciones",
    description: "Resolver problemas de proporciones usando regla de tres simple.",
    subject: "Matemática",
    estimatedMinutes: 35,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Proporciones",
    subtasks: [
      { title: "Aprender regla de tres", isCompleted: false },
      { title: "Resolver problema 1", isCompleted: false },
      { title: "Resolver problema 2", isCompleted: false },
      { title: "Resolver problema 3", isCompleted: false }
    ]
  },

  // --- Lengua y Literatura (6 tareas) ---
  {
    title: "Análisis de oraciones",
    description: "Analizar oraciones identificando Sujeto, Predicado y Núcleos.",
    subject: "Lengua Española",
    estimatedMinutes: 40,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Gramática",
    subtasks: [
      { title: "Definir sujeto y predicado", isCompleted: false },
      { title: "Analizar oración 1", isCompleted: false },
      { title: "Analizar oración 2", isCompleted: false },
      { title: "Analizar oración 3", isCompleted: false }
    ]
  },
  {
    title: "Las 5W de una noticia",
    description: "Leer una noticia y señalar las 5 'W' (Qué, Quién, Cuándo, Dónde, Por qué).",
    subject: "Lengua Española",
    estimatedMinutes: 25,
    difficulty: 2,
    ageGroup: "TEENAGER",
    topic: "Comprensión lectora",
    subtasks: [
      { title: "Seleccionar una noticia", isCompleted: false },
      { title: "Identificar el QUÉ sucedió", isCompleted: false },
      { title: "Identificar el QUIÉN", isCompleted: false },
      { title: "Identificar CUÁNDO y DÓNDE", isCompleted: false },
      { title: "Identificar POR QUÉ", isCompleted: false }
    ]
  },
  {
    title: "Cuento de terror",
    description: "Escribir un cuento de terror de dos carillas usando conectores temporales.",
    subject: "Lengua Española",
    estimatedMinutes: 50,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Escritura creativa",
    subtasks: [
      { title: "Planificar la historia", isCompleted: false },
      { title: "Escribir primera carilla", isCompleted: false },
      { title: "Escribir segunda carilla", isCompleted: false },
      { title: "Usar conectores temporales", isCompleted: false }
    ]
  },
  {
    title: "Poema a prosa",
    description: "Transformar un poema en un texto narrativo (prosa).",
    subject: "Lengua Española",
    estimatedMinutes: 35,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Transformación de textos",
    subtasks: [
      { title: "Leer y comprender el poema", isCompleted: false },
      { title: "Identificar ideas principales", isCompleted: false },
      { title: "Escribir en prosa", isCompleted: false },
      { title: "Revisar coherencia", isCompleted: false }
    ]
  },
  {
    title: "Palabras nuevas",
    description: "Buscar 10 palabras desconocidas en el diccionario y usarlas en un párrafo.",
    subject: "Lengua Española",
    estimatedMinutes: 30,
    difficulty: 2,
    ageGroup: "TEENAGER",
    topic: "Vocabulario",
    subtasks: [
      { title: "Buscar 10 palabras difíciles", isCompleted: false },
      { title: "Anotar definiciones", isCompleted: false },
      { title: "Escribir párrafo usando todas", isCompleted: false }
    ]
  },
  {
    title: "Cartas al editor",
    description: "Escribir una carta al director de un periódico sobre un tema de actualidad.",
    subject: "Lengua Española",
    estimatedMinutes: 40,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Texto argumentativo",
    subtasks: [
      { title: "Elegir tema de actualidad", isCompleted: false },
      { title: "Redactar carta con estructura", isCompleted: false },
      { title: "Firmar y fechar", isCompleted: false }
    ]
  },

  // --- Historia (5 tareas) ---
  {
    title: "Revolución de Mayo",
    description: "Investigar las causas de la Revolución de Mayo y hacer un mapa conceptual.",
    subject: "Historia",
    estimatedMinutes: 50,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Independencia",
    subtasks: [
      { title: "Investigar causas políticas", isCompleted: false },
      { title: "Investigar causas económicas", isCompleted: false },
      { title: "Investigar causas sociales", isCompleted: false },
      { title: "Crear mapa conceptual", isCompleted: false }
    ]
  },
  {
    title: "Mapa de América del Sur",
    description: "Ubicar en un mapa político de América del Sur todos los países y sus capitales.",
    subject: "Historia",
    estimatedMinutes: 45,
    difficulty: 2,
    ageGroup: "TEENAGER",
    topic: "Geografía histórica",
    subtasks: [
      { title: "Dibujar mapa sin nombres", isCompleted: false },
      { title: "Ubicar países", isCompleted: false },
      { title: "Escribir capitales", isCompleted: false },
      { title: "Colorear según región", isCompleted: false }
    ]
  },
  {
    title: "Colonia vs Actualidad",
    description: "Comparar la vida en la época colonial con la actual (transporte, comunicación).",
    subject: "Historia",
    estimatedMinutes: 40,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Cambio histórico",
    subtasks: [
      { title: "Investigar transporte colonial", isCompleted: false },
      { title: "Investigar comunicación colonial", isCompleted: false },
      { title: "Comparar con actual", isCompleted: false },
      { title: "Crear cuadro comparativo", isCompleted: false }
    ]
  },
  {
    title: "Clima vs Tiempo",
    description: "Explicar la diferencia entre 'clima' y 'tiempo atmosférico'.",
    subject: "Historia",
    estimatedMinutes: 25,
    difficulty: 2,
    ageGroup: "TEENAGER",
    topic: "Geografía",
    subtasks: [
      { title: "Definir tiempo atmosférico", isCompleted: false },
      { title: "Definir clima", isCompleted: false },
      { title: "Dar 3 ejemplos de diferencia", isCompleted: false }
    ]
  },
  {
    title: "Cultura indígena",
    description: "Investigar una cultura indígena regional y sus costumbres principales.",
    subject: "Historia",
    estimatedMinutes: 45,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Culturas originarias",
    subtasks: [
      { title: "Elegir cultura indígena", isCompleted: false },
      { title: "Investigar ubicación", isCompleted: false },
      { title: "Investigar costumbres", isCompleted: false },
      { title: "Crear informe breve", isCompleted: false }
    ]
  },

  // --- Ciencias (6 tareas) ---
  {
    title: "Estados de la materia",
    description: "Explicar los tres estados de la materia con ejemplos del hogar.",
    subject: "Ciencias",
    estimatedMinutes: 30,
    difficulty: 2,
    ageGroup: "TEENAGER",
    topic: "Estados de la materia",
    subtasks: [
      { title: "Definir estado sólido", isCompleted: false },
      { title: "Definir estado líquido", isCompleted: false },
      { title: "Definir estado gaseoso", isCompleted: false },
      { title: "Dar 3 ejemplos de cada uno", isCompleted: false }
    ]
  },
  {
    title: "Experimento: Velocidad en rampa",
    description: "Medir la velocidad de un juguete que baja por una rampa.",
    subject: "Ciencias",
    estimatedMinutes: 35,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Velocidad",
    subtasks: [
      { title: "Armar rampa con libros", isCompleted: false },
      { title: "Medir distancia", isCompleted: false },
      { title: "Medir tiempo con cronómetro", isCompleted: false },
      { title: "Calcular velocidad", isCompleted: false }
    ]
  },
  {
    title: "Mezclas homogéneas y heterogéneas",
    description: "Diferenciar entre mezclas homogéneas y heterogéneas en la preparación de alimentos.",
    subject: "Ciencias",
    estimatedMinutes: 30,
    difficulty: 2,
    ageGroup: "TEENAGER",
    topic: "Mezclas",
    subtasks: [
      { title: "Definir mezcla homogénea", isCompleted: false },
      { title: "Definir mezcla heterogénea", isCompleted: false },
      { title: "Dar ejemplos culinarios", isCompleted: false }
    ]
  },
  {
    title: "Modelo de átomo",
    description: "Investigar qué es un átomo y dibujar un modelo sencillo.",
    subject: "Ciencias",
    estimatedMinutes: 40,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Átomo",
    subtasks: [
      { title: "Investigar protones, neutrones, electrones", isCompleted: false },
      { title: "Dibujar modelo básico", isCompleted: false },
      { title: "Explicar con palabras propias", isCompleted: false }
    ]
  },
  {
    title: "Termómetro casero",
    description: "Crear un termómetro casero usando una botella, agua y un sorbete.",
    subject: "Ciencias",
    estimatedMinutes: 35,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Temperatura",
    subtasks: [
      { title: "Reunir materiales", isCompleted: false },
      { title: "Armar el termómetro", isCompleted: false },
      { title: "Calibrar con agua caliente y fría", isCompleted: false },
      { title: "Medir temperatura ambiente", isCompleted: false }
    ]
  },
  {
    title: "Ciclo de vida de mariposa",
    description: "Investigar y dibujar las etapas del ciclo de vida de una mariposa.",
    subject: "Ciencias",
    estimatedMinutes: 30,
    difficulty: 2,
    ageGroup: "TEENAGER",
    topic: "Biología",
    subtasks: [
      { title: "Investigar etapas", isCompleted: false },
      { title: "Dibujar huevo", isCompleted: false },
      { title: "Dibujar oruga", isCompleted: false },
      { title: "Dibujar crisálida", isCompleted: false },
      { title: "Dibujar mariposa", isCompleted: false }
    ]
  },

  // --- Física (4 tareas) ---
  {
    title: "Fuerza y movimiento",
    description: "Investigar qué es la fuerza y cómo cambia el movimiento de los objetos.",
    subject: "Física",
    estimatedMinutes: 35,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Fuerza",
    subtasks: [
      { title: "Definir fuerza", isCompleted: false },
      { title: "Investigar Primera Ley de Newton", isCompleted: false },
      { title: "Dar 3 ejemplos cotidianos", isCompleted: false }
    ]
  },
  {
    title: "Circuito eléctrico simple",
    description: "Construir un circuito eléctrico simple con pila, cables y bombilla.",
    subject: "Física",
    estimatedMinutes: 40,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Electricidad",
    subtasks: [
      { title: "Reunir materiales", isCompleted: false },
      { title: "Dibujar circuito antes de construir", isCompleted: false },
      { title: "Armar el circuito", isCompleted: false },
      { title: "Explicar flujo de corriente", isCompleted: false }
    ]
  },
  {
    title: "Energía cinética",
    description: "Investigar qué es la energía cinética y dar ejemplos del entorno.",
    subject: "Física",
    estimatedMinutes: 30,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Energía",
    subtasks: [
      { title: "Definir energía cinética", isCompleted: false },
      { title: "Dar ejemplos", isCompleted: false },
      { title: "Relacionar con velocidad", isCompleted: false }
    ]
  },
  {
    title: "Lentes y espejos",
    description: "Investigar cómo funcionan las lupas y los espejos planos y curvos.",
    subject: "Física",
    estimatedMinutes: 35,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Óptica",
    subtasks: [
      { title: "Experimentar con lupa", isCompleted: false },
      { title: "Experimentar con espejo plano", isCompleted: false },
      { title: "Investigar espejo curvo", isCompleted: false },
      { title: "Explicar diferencias", isCompleted: false }
    ]
  },

  // --- Química (4 tareas) ---
  {
    title: "Elementos de la cocina",
    description: "Identificar elementos químicos comunes en la cocina y sus símbolos.",
    subject: "Química",
    estimatedMinutes: 30,
    difficulty: 2,
    ageGroup: "TEENAGER",
    topic: "Elementos",
    subtasks: [
      { title: "Buscar sal (NaCl)", isCompleted: false },
      { title: "Buscar agua (H2O)", isCompleted: false },
      { title: "Buscar otros elementos", isCompleted: false }
    ]
  },
  {
    title: "Cambios físicos y químicos",
    description: "Identificar cambios físicos y químicos en la cocina.",
    subject: "Química",
    estimatedMinutes: 35,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Cambios de la materia",
    subtasks: [
      { title: "Observar cambio físico (derretir hielo)", isCompleted: false },
      { title: "Observar cambio químico (hornear)", isCompleted: false },
      { title: "Clasificar 5 ejemplos", isCompleted: false }
    ]
  },
  {
    title: "pH de líquidos",
    description: "Investigar qué es el pH y probar con jugos, agua y jabón.",
    subject: "Química",
    estimatedMinutes: 35,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Ácidos y bases",
    subtasks: [
      { title: "Investigar escala de pH", isCompleted: false },
      { title: "Clasificar jugos como ácidos", isCompleted: false },
      { title: "Clasificar jabón como base", isCompleted: false }
    ]
  },
  {
    title: "Reacciones químicas",
    description: "Observar una reacción química simple (vinagre + bicarbonato).",
    subject: "Química",
    estimatedMinutes: 25,
    difficulty: 2,
    ageGroup: "TEENAGER",
    topic: "Reacciones",
    subtasks: [
      { title: "Reunir materiales", isCompleted: false },
      { title: "Mezclar y observar", isCompleted: false },
      { title: "Explicar qué sucedió", isCompleted: false }
    ]
  },

  // --- Geografía (5 tareas) ---
  {
    title: "Ríos de Uruguay",
    description: "Investigar los principales ríos de Uruguay y su importancia.",
    subject: "Geografía",
    estimatedMinutes: 35,
    difficulty: 2,
    ageGroup: "TEENAGER",
    topic: "Hidrografía",
    subtasks: [
      { title: "Buscar río Uruguay", isCompleted: false },
      { title: "Buscar río Paraná", isCompleted: false },
      { title: "Buscar río Negro", isCompleted: false },
      { title: "Dibujar mapa fluvial", isCompleted: false }
    ]
  },
  {
    title: "Regiones de Uruguay",
    description: "Investigar las 4 regiones de Uruguay y sus características.",
    subject: "Geografía",
    estimatedMinutes: 40,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Regiones",
    subtasks: [
      { title: "Costa sur", isCompleted: false },
      { title: "Cuchilla Grande", isCompleted: false },
      { title: "Llanura pampeana", isCompleted: false },
      { title: "Cuyo (si aplica)", isCompleted: false }
    ]
  },
  {
    title: "Capas de la Tierra",
    description: "Investigar las capas de la Tierra: corteza, manto, núcleo.",
    subject: "Geografía",
    estimatedMinutes: 30,
    difficulty: 2,
    ageGroup: "TEENAGER",
    topic: "Estructura terrestre",
    subtasks: [
      { title: "Investigar corteza", isCompleted: false },
      { title: "Investigar manto", isCompleted: false },
      { title: "Investigar núcleo", isCompleted: false },
      { title: "Dibujar esquema", isCompleted: false }
    ]
  },
  {
    title: "Tipos de mapas",
    description: "Diferenciar entre mapa político, físico y temático.",
    subject: "Geografía",
    estimatedMinutes: 25,
    difficulty: 2,
    ageGroup: "TEENAGER",
    topic: "Cartografía",
    subtasks: [
      { title: "Definir mapa político", isCompleted: false },
      { title: "Definir mapa físico", isCompleted: false },
      { title: "Definir mapa temático", isCompleted: false },
      { title: "Dar ejemplos", isCompleted: false }
    ]
  },
  {
    title: "Coordenadas geográficas",
    description: "Aprender a leer latitud y longitud en un mapa.",
    subject: "Geografía",
    estimatedMinutes: 35,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Coordenadas",
    subtasks: [
      { title: "Definir latitud", isCompleted: false },
      { title: "Definir longitud", isCompleted: false },
      { title: "Practicar con mapa", isCompleted: false }
    ]
  },

  // ============================================
  // NIVEL MEDIA SUPERIOR (14-16 años) | 40 Tareas
  // Foco: Pensamiento crítico, abstracción científica y ensayo
  // ============================================

  // --- Matemática y Física (6 tareas) ---
  {
    title: "Sistemas de ecuaciones",
    description: "Resolver sistemas de ecuaciones lineales 2x2 por el método de sustitución.",
    subject: "Matemática",
    estimatedMinutes: 50,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Álgebra",
    subtasks: [
      { title: "Resolver sistema 1", isCompleted: false },
      { title: "Resolver sistema 2", isCompleted: false },
      { title: "Resolver sistema 3", isCompleted: false },
      { title: "Verificar soluciones", isCompleted: false }
    ]
  },
  {
    title: "Segunda Ley de Newton",
    description: "Calcular la fuerza necesaria para mover un objeto usando F = m × a.",
    subject: "Física",
    estimatedMinutes: 45,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Dinámica",
    subtasks: [
      { title: "Comprender F = m × a", isCompleted: false },
      { title: "Resolver problema 1", isCompleted: false },
      { title: "Resolver problema 2", isCompleted: false }
    ]
  },
  {
    title: "Funciones cuadráticas",
    description: "Graficar funciones cuadráticas y halla sus raíces.",
    subject: "Matemática",
    estimatedMinutes: 50,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Funciones",
    subtasks: [
      { title: "Graficar parábola 1", isCompleted: false },
      { title: "Hallar raíces", isCompleted: false },
      { title: "Graficar parábola 2", isCompleted: false },
      { title: "Analizar vértice", isCompleted: false }
    ]
  },
  {
    title: "Energía potencial",
    description: "Calcular la energía potencial de un objeto a cierta altura (Ep = m × g × h).",
    subject: "Física",
    estimatedMinutes: 40,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Energía",
    subtasks: [
      { title: "Comprender fórmula Ep", isCompleted: false },
      { title: "Calcular para objeto a 2m", isCompleted: false },
      { title: "Calcular para objeto a 5m", isCompleted: false }
    ]
  },
  {
    title: "Trigonometría",
    description: "Realizar ejercicios de trigonometría (Seno, Coseno, Tangente) en triángulos rectángulos.",
    subject: "Matemática",
    estimatedMinutes: 45,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Trigonometría",
    subtasks: [
      { title: "Repasar razones trigonométricas", isCompleted: false },
      { title: "Resolver triángulo 1", isCompleted: false },
      { title: "Resolver triángulo 2", isCompleted: false }
    ]
  },
  {
    title: "Probabilidad",
    description: "Resolver problemas de probabilidad con eventos independientes.",
    subject: "Matemática",
    estimatedMinutes: 40,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Probabilidad",
    subtasks: [
      { title: "Definir probabilidad", isCompleted: false },
      { title: "Resolver problema de dados", isCompleted: false },
      { title: "Resolver problema de monedas", isCompleted: false }
    ]
  },

  // --- Química (5 tareas) ---
  {
    title: "Balanceo de ecuaciones",
    description: "Balancear 10 ecuaciones químicas por el método de tanteo.",
    subject: "Química",
    estimatedMinutes: 50,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Balanceo",
    subtasks: [
      { title: "Balancear ecuación 1", isCompleted: false },
      { title: "Balancear ecuación 2", isCompleted: false },
      { title: "Balancear ecuaciones 3-10", isCompleted: false }
    ]
  },
  {
    title: "Grupos funcionales",
    description: "Identificar grupos funcionales en moléculas orgánicas básicas.",
    subject: "Química",
    estimatedMinutes: 45,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Química orgánica",
    subtasks: [
      { title: "Identificar alcohol", isCompleted: false },
      { title: "Identificar ácido carboxílico", isCompleted: false },
      { title: "Identificar éter", isCompleted: false }
    ]
  },
  {
    title: "Molaridad",
    description: "Calcular la molaridad de una solución dada su masa y volumen.",
    subject: "Química",
    estimatedMinutes: 45,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Soluciones",
    subtasks: [
      { title: "Comprender molaridad", isCompleted: false },
      { title: "Calcular M para problema 1", isCompleted: false },
      { title: "Calcular M para problema 2", isCompleted: false }
    ]
  },
  {
    title: "Electronegatividad",
    description: "Investigar la Tabla Periódica y explicar la tendencia de la electronegatividad.",
    subject: "Química",
    estimatedMinutes: 40,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Tabla periódica",
    subtasks: [
      { title: "Investigar electronegatividad", isCompleted: false },
      { title: "Explicar tendencia periódica", isCompleted: false },
      { title: "Dar ejemplos", isCompleted: false }
    ]
  },
  {
    title: "Impacto ambiental de plásticos",
    description: "Realizar un informe sobre el impacto ambiental de los plásticos (polímeros).",
    subject: "Química",
    estimatedMinutes: 60,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Química ambiental",
    subtasks: [
      { title: "Investigar tipos de plásticos", isCompleted: false },
      { title: "Investigar biodegradabilidad", isCompleted: false },
      { title: "Analizar impacto oceans", isCompleted: false },
      { title: "Proponer soluciones", isCompleted: false }
    ]
  },

  // --- Lengua y Literatura (6 tareas) ---
  {
    title: "Ensayo sobre IA",
    description: "Escribir un ensayo argumentativo sobre el impacto de la Inteligencia Artificial.",
    subject: "Lengua Española",
    estimatedMinutes: 90,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Ensayo",
    subtasks: [
      { title: "Planificar tesis", isCompleted: false },
      { title: "Argumento 1 con fuentes", isCompleted: false },
      { title: "Argumento 2 con fuentes", isCompleted: false },
      { title: "Contraargumento", isCompleted: false },
      { title: "Conclusión", isCompleted: false }
    ]
  },
  {
    title: "Realismo Mágico",
    description: "Analizar el uso del Realismo Mágico en un capítulo de Cien años de soledad.",
    subject: "Lengua Española",
    estimatedMinutes: 60,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Literatura latinoamericana",
    subtasks: [
      { title: "Leer capítulo seleccionado", isCompleted: false },
      { title: "Identificar elementos mágicos", isCompleted: false },
      { title: "Analizar contexto histórico", isCompleted: false },
      { title: "Redactar análisis", isCompleted: false }
    ]
  },
  {
    title: "Lenguaje inclusivo",
    description: "Debatir sobre la evolución del lenguaje: ¿el lenguaje inclusivo es gramatical?",
    subject: "Lengua Española",
    estimatedMinutes: 50,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Gramática y sociedad",
    subtasks: [
      { title: "Investigar debate actual", isCompleted: false },
      { title: "Argumentos a favor", isCompleted: false },
      { title: "Argumentos en contra", isCompleted: false },
      { title: "Posición personal fundamentada", isCompleted: false }
    ]
  },
  {
    title: "Análisis métrico",
    description: "Realizar un análisis métrico y de rima de tres sonetos clásicos.",
    subject: "Lengua Española",
    estimatedMinutes: 55,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Poesía",
    subtasks: [
      { title: "Analizar soneto 1 (medir versos)", isCompleted: false },
      { title: "Identificar rimas", isCompleted: false },
      { title: "Analizar soneto 2", isCompleted: false },
      { title: "Analizar soneto 3", isCompleted: false }
    ]
  },
  {
    title: "Currículum Vitae",
    description: "Redactar un currículum vitae profesional y una carta de presentación.",
    subject: "Lengua Española",
    estimatedMinutes: 50,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Escritura laboral",
    subtasks: [
      { title: "Plantear datos personales", isCompleted: false },
      { title: "Redactar experiencia", isCompleted: false },
      { title: "Escribir carta de presentación", isCompleted: false }
    ]
  },
  {
    title: "Resumen de libro",
    description: "Escribir un resumen académico de un libro leído en clase.",
    subject: "Lengua Española",
    estimatedMinutes: 45,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Comprensión",
    subtasks: [
      { title: "Identificar ideas principales", isCompleted: false },
      { title: "Escribir introducción", isCompleted: false },
      { title: "Desarrollar nudos principales", isCompleted: false },
      { title: "Redactar conclusión", isCompleted: false }
    ]
  },

  // --- Historia (6 tareas) ---
  {
    title: "Revolución Industrial",
    description: "Analizar las consecuencias económicas de la Revolución Industrial en el Río de la Plata.",
    subject: "Historia",
    estimatedMinutes: 70,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Revolución Industrial",
    subtasks: [
      { title: "Investigar causas", isCompleted: false },
      { title: "Analizar impacto en Argentina", isCompleted: false },
      { title: "Analizar impacto en Uruguay", isCompleted: false },
      { title: "Sacar conclusiones", isCompleted: false }
    ]
  },
  {
    title: "Guerra Fría y dictaduras",
    description: "Investigar la Guerra Fría y su impacto en las dictaduras latinoamericanas.",
    subject: "Historia",
    estimatedMinutes: 75,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Historia contemporánea",
    subtasks: [
      { title: "Definir Guerra Fría", isCompleted: false },
      { title: "Dictaduras del Cono Sur", isCompleted: false },
      { title: "Impacto social", isCompleted: false },
      { title: "Transición democrática", isCompleted: false }
    ]
  },
  {
    title: "Geopolítica del agua",
    description: "Analizar el conflicto por los recursos hídricos en el mundo actual.",
    subject: "Historia",
    estimatedMinutes: 60,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Geopolítica",
    subtasks: [
      { title: "Casos de conflicto por agua", isCompleted: false },
      { title: "Medio Oriente", isCompleted: false },
      { title: "América Latina", isCompleted: false },
      { title: "Proyecciones futuras", isCompleted: false }
    ]
  },
  {
    title: "Pirámide poblacional",
    description: "Elaborar un informe sobre la pirámide poblacional de Uruguay y sus desafíos.",
    subject: "Historia",
    estimatedMinutes: 55,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Demografía",
    subtasks: [
      { title: "Analizar pirámide actual", isCompleted: false },
      { title: "Identificar envejecimiento", isCompleted: false },
      { title: "Analizar natalidad", isCompleted: false },
      { title: "Proponer desafíos", isCompleted: false }
    ]
  },
  {
    title: "Democracia vs Autoritarismo",
    description: "Comparar los sistemas de gobierno: Democracia vs. Autoritarismo en el siglo XX.",
    subject: "Historia",
    estimatedMinutes: 65,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Sistemas políticos",
    subtasks: [
      { title: "Definir democracia", isCompleted: false },
      { title: "Definir autoritarismo", isCompleted: false },
      { title: "Casos históricos", isCompleted: false },
      { title: "Comparación fundamentada", isCompleted: false }
    ]
  },
  {
    title: "Globalización",
    description: "Analizar el impacto de la globalización en la economía local.",
    subject: "Historia",
    estimatedMinutes: 50,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Economía global",
    subtasks: [
      { title: "Definir globalización", isCompleted: false },
      { title: "Impacto en exportaciones", isCompleted: false },
      { title: "Impacto en empleo", isCompleted: false },
      { title: "Posición crítica", isCompleted: false }
    ]
  },

  // --- Ciencias (4 tareas) ---
  {
    title: "Genética básica",
    description: "Investigar qué son los genes y cómo se heredan los caracteres.",
    subject: "Ciencias",
    estimatedMinutes: 45,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Genética",
    subtasks: [
      { title: "Definir gen", isCompleted: false },
      { title: "Investigar ADN", isCompleted: false },
      { title: "Herencia dominante/recesiva", isCompleted: false }
    ]
  },
  {
    title: "Ecosistemas",
    description: "Investigar un ecosistema local y sus cadenas alimenticias.",
    subject: "Ciencias",
    estimatedMinutes: 50,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Ecología",
    subtasks: [
      { title: "Identificar ecosistema", isCompleted: false },
      { title: "Productores, consumidores, descomponedores", isCompleted: false },
      { title: "Cadena alimenticia", isCompleted: false }
    ]
  },
  {
    title: "Sistema solar",
    description: "Investigar los planetas del sistema solar y sus características.",
    subject: "Ciencias",
    estimatedMinutes: 40,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Astronomía",
    subtasks: [
      { title: "Planetas rocosos", isCompleted: false },
      { title: "Planetas gaseosos", isCompleted: false },
      { title: "Características destacadas", isCompleted: false }
    ]
  },
  {
    title: "Cambio climático",
    description: "Investigar las causas y consecuencias del cambio climático.",
    subject: "Ciencias",
    estimatedMinutes: 55,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Medio ambiente",
    subtasks: [
      { title: "Causas antrópicas", isCompleted: false },
      { title: "Consecuencias globales", isCompleted: false },
      { title: "Impacto en Uruguay", isCompleted: false },
      { title: "Mitigación y adaptación", isCompleted: false }
    ]
  },

  // --- Física (4 tareas) ---
  {
    title: "Leyes de Kepler",
    description: "Investigar las leyes de Kepler sobre el movimiento de los planetas.",
    subject: "Física",
    estimatedMinutes: 45,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Astronomía",
    subtasks: [
      { title: "Primera ley (órbitas)", isCompleted: false },
      { title: "Segunda ley (velocidad)", isCompleted: false },
      { title: "Tercera ley (períodos)", isCompleted: false }
    ]
  },
  {
    title: "Electromagnetismo",
    description: "Investigar la relación entre electricidad y magnetismo.",
    subject: "Física",
    estimatedMinutes: 50,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Electromagnetismo",
    subtasks: [
      { title: "Experimento de Oersted", isCompleted: false },
      { title: "Generadores eléctricos", isCompleted: false },
      { title: "Aplicaciones cotidianas", isCompleted: false }
    ]
  },
  {
    title: "Movimiento circular",
    description: "Resolver problemas de movimiento circular uniforme.",
    subject: "Física",
    estimatedMinutes: 45,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Cinemática",
    subtasks: [
      { title: "Velocidad angular", isCompleted: false },
      { title: "Aceleración centrípeta", isCompleted: false },
      { title: "Problema aplicado", isCompleted: false }
    ]
  },
  {
    title: "Principio de Arquímedes",
    description: "Investigar el principio de Arquímedes y calcular flotabilidad.",
    subject: "Física",
    estimatedMinutes: 45,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Hidrostática",
    subtasks: [
      { title: "Comprender principio", isCompleted: false },
      { title: "Calcular empuje", isCompleted: false },
      { title: "Problema de flotación", isCompleted: false }
    ]
  },

  // --- Geografía (4 tareas) ---
  {
    title: "Globalización cultural",
    description: "Analizar cómo la globalización influye en la cultura local.",
    subject: "Geografía",
    estimatedMinutes: 50,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Cultura global",
    subtasks: [
      { title: "Identificar influencias foráneas", isCompleted: false },
      { title: "Preservación de cultura local", isCompleted: false },
      { title: "Hibridación cultural", isCompleted: false }
    ]
  },
  {
    title: "Recursos naturales",
    description: "Investigar los recursos naturales de Uruguay y su explotación.",
    subject: "Geografía",
    estimatedMinutes: 45,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Recursos",
    subtasks: [
      { title: "Recursos agrícolas", isCompleted: false },
      { title: "Recursos mineros", isCompleted: false },
      { title: "Recursos pesqueros", isCompleted: false }
    ]
  },
  {
    title: "Urbanización",
    description: "Analizar el proceso de urbanización en Uruguay.",
    subject: "Geografía",
    estimatedMinutes: 40,
    difficulty: 4,
    ageGroup: "TEENAGER",
    topic: "Urbanismo",
    subtasks: [
      { title: "Crecimiento de Montevideo", isCompleted: false },
      { title: "Ciudades del interior", isCompleted: false },
      { title: "Problemas urbanos", isCompleted: false }
    ]
  },
  {
    title: "Organismos internacionales",
    description: "Investigar el rol de organismos como ONU, Mercosur, CELAC.",
    subject: "Geografía",
    estimatedMinutes: 45,
    difficulty: 3,
    ageGroup: "TEENAGER",
    topic: "Geopolítica",
    subtasks: [
      { title: "ONU y sus agencias", isCompleted: false },
      { title: " Mercosur", isCompleted: false },
      { title: "CELAC", isCompleted: false }
    ]
  }
];

async function seedTasks() {
  console.log('🌱 Iniciando seed de tareas educativas...\n');

  try {
    const user = await prisma.user.findFirst({
      where: { role: 'STUDENT' }
    });

    if (!user) {
      console.log('❌ No hay usuarios registrados. Por favor regístrate primero.');
      return;
    }

    console.log(`✅ Usuario encontrado: ${user.email}\n`);
    console.log(`📚 Total de tareas a sembrar: ${tasks.length}\n`);

    let created = 0;
    let skipped = 0;

    for (const taskData of tasks) {
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

      console.log(`✅ ${taskData.subject} - ${taskData.title}`);
      created++;
    }

    console.log(`\n🎉 Seed completado!`);
    console.log(`   Tareas creadas: ${created}`);
    console.log(`   Tareas saltadas (ya existían): ${skipped}`);
    console.log(`   Total tareas disponibles: ${tasks.length}`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTasks();

export default seedTasks;
