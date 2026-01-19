const SocraticPrompts = {
  CHILD: {
    system: `Eres un tutor amigable para niños de 8-12 años. 
Usa lenguaje sencillo, ejemplos con cosas que conocen (deportes, videojuegos, animales).
Sé muy paciente y usa muchos ánimos como "¡Muy bien!", "¡Excelente!", "¡Puedes hacerlo!".
Cuando ayuden, guíen paso a paso con preguntas fáciles.
Eviten dar la respuesta directamente - dejan que el niño la descubra.
Usen emojis ocasionalmente para hacerlo más divertido.
Máximo 2-3 oraciones por mensaje.`,
    
    physics: `Ayuda a entender física básica con ejemplos cotidianos:
- Gravedad: "Cuando saltas, bajas porque la Tierra te atrae"
- Velocidad: "Tan rápido como tu personaje favorito de videojuego"
- Fuerza: "Como cuando empujas tu carrito de compras"
Nunca des la fórmula directamente, haz que la descubran con preguntas.`
  },
  
  TEENAGER: {
    system: `Eres un tutor para adolescentes de 13-18 años.
Usa un tono respetuoso pero cercano, sin ser condescendiente.
Guía mediante el método socrático: pregunta tras pregunta para que lleguen a la conclusión.
Sé directo y eficiente con las explicaciones.
Usa analogías relevantes para su edad.
Valida sus esfuerzos y ofrece desafíos para profundizar.`,
    
    physics: `Para problemas de física:
1. Identifica qué datos已知 (conocidos) y qué se pide
2. Pregunta qué formulas podrían aplicar
3. Guía en la selección de la fórmula correcta
4. Ayuda a identificar unidades y conversiones
5. Verifica que el resultado tenga sentido
No des la solución hasta que demuestren haber entendido el proceso.`
  }
};

export class TutorService {
  constructor(ageGroup) {
    this.ageGroup = ageGroup;
    this.systemPrompt = ageGroup === 'CHILD' ? SocraticPrompts.CHILD : SocraticPrompts.TEENAGER;
    this.conversationHistory = [];
  }

  async generateResponse(userMessage, context = {}) {
    const lastMessages = this.conversationHistory.slice(-6);
    
    const messages = [
      { role: 'system', content: this.systemPrompt.system },
      { role: 'system', content: this.systemPrompt.physics },
      ...lastMessages,
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await this.callLLM(messages, context);
      this.conversationHistory.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: response.reply }
      );
      return response;
    } catch (error) {
      console.error('Error en TutorService:', error);
      return {
        reply: 'Tuve un problema temporal. ¿Podrías reformular tu pregunta?',
        nextQuestion: '¿En qué parte del problema tienes dudas?'
      };
    }
  }

  async callLLM(messages, context) {
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'your-api-key-here' || apiKey.startsWith('gsk_') === false) {
      console.log('TutorService: No valid API key, using mock response');
      return this.getMockResponse(messages[messages.length - 1].content);
    }

    const provider = process.env.LLM_PROVIDER || 'groq';
    const baseUrl = provider === 'groq' 
      ? 'https://api.groq.com/openai/v1'
      : 'https://api.openai.com/v1';

    // Updated: Use newer Groq models (llama3.1 replaces llama3)
    const model = provider === 'groq' ? 'llama-3.1-8b-instant' : 'gpt-4o-mini';

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('TutorService: API error:', response.status, errorData);
        return this.getMockResponse(messages[messages.length - 1].content);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('TutorService: Invalid response format:', data);
        return this.getMockResponse(messages[messages.length - 1].content);
      }

      return {
        reply: data.choices[0].message.content,
        nextQuestion: this.generateFollowUpQuestion(messages[messages.length - 1].content)
      };
    } catch (error) {
      console.error('TutorService: API call failed:', error.message);
      return this.getMockResponse(messages[messages.length - 1].content);
    }
  }

  getMockResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('tren') || lowerMessage.includes('velocidad')) {
      return {
        reply: '¡Bien hecho por identificar los datos! 🏃\n\n72 km/h es la velocidad. Ahora pensa: si algo va a esa velocidad por 1 hora, recorre 72 km. ¿Y si va 2 horas?',
        nextQuestion: '¿Qué operación matemática relaciona velocidad y tiempo para obtener distancia?'
      };
    }
    
    if (lowerMessage.includes('no entiendo') || lowerMessage.includes('ayuda')) {
      return {
        reply: '¡No te preocupes, estamos aquí para aprender juntos! 😊\n\nCuéntame más específicamente: ¿qué parte del problema te confunde?',
        nextQuestion: '¿Es los datos, la fórmula, o cómo aplicarla?'
      };
    }

    return {
      reply: 'Interesante pregunta. Vamos a resolverlo paso a paso.\n\nPrimero, ¿qué información tienes del problema?',
      nextQuestion: '¿Qué crees que te están pidiendo encontrar?'
    };
  }

  generateFollowUpQuestion(message) {
    const questions = [
      '¿Qué datos del problema has identificado?',
      '¿Qué fórmula crees que podría servir?',
      '¿Has revisado las unidades? ¿Necesitas convertir algo?',
      '¿Qué resultado obtuviste? ¿Tiene sentido?',
      '¿Quieres practicar con otro problema similar?'
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  generateHint(question, context) {
    const hints = {
      physics: [
        'Pensa en las unidades... km/h por horas da...',
        'La fórmula básica es: distancia = velocidad × tiempo',
        '¿Qué operasi te dan las unidades correctas?'
      ],
      math: [
        '¿Qué operación inversa podrías usar?',
        '画 un diagrama con lo que conoces',
        'Sustituye los valores que conoces en la fórmula'
      ],
      default: [
        '¿Qué sabes seguro del problema?',
        '¿Qué te pide exactamente la pregunta?',
        '¿Hay algo parecido que hayas resuelto antes?'
      ]
    };

    const category = context.subject?.toLowerCase() || 'default';
    const categoryHints = hints[category] || hints.default;
    return categoryHints[Math.floor(Math.random() * categoryHints.length)];
  }
}

export default TutorService;
