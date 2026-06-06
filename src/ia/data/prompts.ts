// ============================================================================
// "Prompts de aprendizaje al extremo": meta-prompts para dominar cualquier tema
// con IA. Basados en técnicas Feynman, active recall, primeros principios y
// debate socrático. Usa {tema} como marcador para reemplazar.
// ============================================================================

export type PromptCat = 'Aprender' | 'Profundizar' | 'Practicar' | 'Pensar crítico' | 'Aplicar';

export interface LearningPrompt {
  id: string;
  titulo: string;
  categoria: PromptCat;
  que: string; // qué hace
  cuando: string; // cuándo usarlo
  prompt: string;
}

export const PROMPT_CATS: PromptCat[] = ['Aprender', 'Profundizar', 'Practicar', 'Pensar crítico', 'Aplicar'];

export const LEARNING_PROMPTS: LearningPrompt[] = [
  {
    id: 'feynman', titulo: 'Técnica Feynman', categoria: 'Aprender',
    que: 'Te explica un tema en lenguaje simple y luego te hace explicarlo para detectar lagunas.',
    cuando: 'Cuando empiezas un tema nuevo y quieres entenderlo de verdad, no memorizarlo.',
    prompt: `Quiero dominar "{tema}" con la técnica Feynman.
1) Explícamelo como si tuviera 12 años, con una analogía cotidiana.
2) Luego pídeme que te lo explique a ti con mis palabras.
3) Detecta exactamente dónde mi explicación falla o se queda corta.
4) Corrige solo esas lagunas con un ejemplo concreto.
Repite el ciclo hasta que mi explicación sea sólida.`,
  },
  {
    id: 'cinco-niveles', titulo: 'Explícamelo en 5 niveles', categoria: 'Aprender',
    que: 'Explica el mismo concepto para niño, estudiante, profesional, gerente y experto.',
    cuando: 'Para ver el tema desde varias profundidades y poder enseñarlo a cualquiera.',
    prompt: `Explícame "{tema}" en 5 niveles, cada uno en 3-4 frases:
1) a un niño, 2) a un estudiante, 3) a un profesional del área, 4) a un gerente que decide presupuesto, 5) a un experto técnico.
Al final, dame la única idea que NO debo olvidar de este tema.`,
  },
  {
    id: 'interrogame', titulo: 'Interrógame (active recall)', categoria: 'Practicar',
    que: 'Te examina con preguntas progresivas y corrige al instante.',
    cuando: 'Para fijar memoria: recordar cuesta esfuerzo y por eso enseña.',
    prompt: `Actúa como tutor exigente de "{tema}". Hazme 1 pregunta a la vez, de menor a mayor dificultad.
Espera mi respuesta, califícala (correcta/parcial/incorrecta), corrígeme con una explicación breve y un ejemplo, y recién entonces pasa a la siguiente.
No me des las respuestas por adelantado. Después de 8 preguntas, dime mis 3 puntos más débiles.`,
  },
  {
    id: 'lagunas', titulo: 'Detecta mis lagunas', categoria: 'Aprender',
    que: 'Mapea lo que NO sabes que no sabes sobre un tema.',
    cuando: 'Cuando ya sabes algo del tema y quieres encontrar tus puntos ciegos.',
    prompt: `Soy intermedio en "{tema}". Hazme un diagnóstico: lístame los 10 subtemas o conceptos que alguien que domina "{tema}" debería conocer.
Para cada uno, hazme una micro-pregunta. Según mis respuestas, dime qué 3 lagunas debo cerrar primero y en qué orden estudiarlas.`,
  },
  {
    id: 'primeros-principios', titulo: 'Primeros principios', categoria: 'Profundizar',
    que: 'Descompone el tema hasta sus verdades básicas y reconstruye desde cero.',
    cuando: 'Para entender el porqué profundo, no solo el cómo.',
    prompt: `Analiza "{tema}" desde primeros principios.
1) ¿Cuáles son las verdades fundamentales e innegables de las que parte?
2) ¿Qué problema resuelve y por qué los enfoques anteriores fallaban?
3) Reconstruye el concepto desde esas bases, sin analogías superficiales.
4) Termina con una pregunta que ponga a prueba si entendí el fondo.`,
  },
  {
    id: 'analogias', titulo: 'Dame 3 analogías', categoria: 'Profundizar',
    que: 'Crea analogías de distintos dominios y aclara dónde fallan.',
    cuando: 'Cuando un concepto abstracto no te termina de "hacer clic".',
    prompt: `Dame 3 analogías distintas (de la vida diaria, de otra ciencia y de los negocios) para entender "{tema}".
Para cada analogía explica en qué se parece y, muy importante, en qué NO se parece (dónde la analogía se rompe), para no crearme una idea equivocada.`,
  },
  {
    id: 'socratico', titulo: 'Debate socrático', categoria: 'Pensar crítico',
    que: 'Te guía con preguntas en vez de darte respuestas, para que razones tú.',
    cuando: 'Para desarrollar criterio propio y no depender de respuestas hechas.',
    prompt: `Sé mi interlocutor socrático sobre "{tema}". No me des respuestas directas: guíame solo con preguntas, una a la vez, que me obliguen a razonar y a justificar lo que digo.
Cuando detectes una contradicción o un supuesto no examinado en mi razonamiento, señálalo con otra pregunta.`,
  },
  {
    id: 'abogado-diablo', titulo: 'Abogado del diablo', categoria: 'Pensar crítico',
    que: 'Cuestiona una idea/decisión para encontrar sus puntos débiles.',
    cuando: 'Antes de adoptar una herramienta, modelo o decisión basada en IA.',
    prompt: `Voy a afirmar algo sobre "{tema}" y quiero que hagas de abogado del diablo riguroso (no troll).
Mi postura: [escribe aquí tu idea o decisión].
Dame los 3 argumentos más fuertes en contra, los riesgos que estoy ignorando, en qué casos mi idea NO aplica, y qué evidencia me haría cambiar de opinión.`,
  },
  {
    id: 'sesgos', titulo: 'Caza-sesgos y límites', categoria: 'Pensar crítico',
    que: 'Revela supuestos, sesgos y límites éticos/técnicos de un enfoque de IA.',
    cuando: 'Al evaluar un sistema de IA antes de confiar en sus salidas.',
    prompt: `Sobre un sistema de IA para "{tema}": ¿qué sesgos podría tener (datos, etiquetado, contexto)?, ¿en qué situaciones fallaría peligrosamente?, ¿qué decisiones NO debería tomar solo?, ¿qué controles (human-in-the-loop, guardrails) pondrías?
Sé concreto y prioriza por impacto.`,
  },
  {
    id: 'genera-ejercicios', titulo: 'Genera mi mini-examen', categoria: 'Practicar',
    que: 'Crea 5 preguntas con explicación, trampa común y dato clave.',
    cuando: 'Para autoevaluarte tras estudiar un tema.',
    prompt: `Crea un mini-examen de 5 preguntas de opción múltiple sobre "{tema}", de dificultad creciente.
Para cada una: 4 alternativas, la respuesta correcta, una explicación breve, el error o trampa más común, y un dato clave para recordarla.
No me muestres las respuestas hasta que yo conteste las 5.`,
  },
  {
    id: 'mapa-mental', titulo: 'Mapa mental + ruta', categoria: 'Aprender',
    que: 'Estructura el tema en un esquema jerárquico y una ruta de estudio.',
    cuando: 'Al inicio, para tener el panorama completo antes de profundizar.',
    prompt: `Dame un mapa mental en texto (jerárquico, con viñetas) de "{tema}": ramas principales, sub-conceptos y cómo se conectan.
Luego propón una ruta de estudio de 5 pasos, de lo fundamental a lo avanzado, indicando qué dominar en cada paso antes de seguir.`,
  },
  {
    id: 'aplicar-trabajo', titulo: 'Aplícalo a mi trabajo', categoria: 'Aplicar',
    que: 'Convierte la teoría en un caso de uso accionable para tu contexto.',
    cuando: 'Cuando entiendes el concepto y quieres convertirlo en valor real.',
    prompt: `Trabajo en [tu rol/sector, ej. construcción/AEC con GEN+]. Tengo este proceso: [describe el proceso].
Aplica "{tema}" a mi caso: ¿qué problema concreto resolvería?, ¿qué datos necesito?, ¿qué herramienta usaría?, ¿cómo mediría el ROI?, y ¿cuál sería un primer experimento pequeño y de bajo riesgo para validarlo esta semana?`,
  },
];
