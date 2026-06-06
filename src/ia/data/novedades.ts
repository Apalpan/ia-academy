// ============================================================================
// Novedades / Tendencias IA — digest curado y FECHADO (snapshot). No es un feed
// en vivo: son tendencias durables a 2026 con "por qué importa" para criterio.
// Actualízalo periódicamente editando este archivo.
// ============================================================================

export interface Trend {
  id: string;
  fecha: string; // periodo del snapshot
  titulo: string;
  categoria: 'Modelos' | 'Agentes' | 'Productividad' | 'Gobernanza' | 'AEC';
  resumen: string;
  porQueImporta: string;
  accion: string; // qué hacer al respecto
}

export const SNAPSHOT_LABEL = 'Snapshot: 1er semestre 2026';

export const TRENDS: Trend[] = [
  {
    id: 'reasoning', fecha: '2026', titulo: 'Modelos que "razonan" (test-time compute)', categoria: 'Modelos',
    resumen: 'Los modelos de razonamiento gastan más cómputo al responder para resolver mejor problemas de lógica, matemática y código.',
    porQueImporta: 'Cambian la ecuación: ya no solo importa el tamaño del modelo, sino cuánto "piensa" en cada respuesta. Suben calidad pero también costo y latencia.',
    accion: 'Usa modelos de razonamiento para tareas difíciles; modelos rápidos/baratos para lo trivial. No pagues "pensar" cuando no hace falta.',
  },
  {
    id: 'agentes', fecha: '2026', titulo: 'El auge de los agentes', categoria: 'Agentes',
    resumen: 'De chatbots a agentes que planifican, usan herramientas y ejecutan tareas multi-paso (con MCP como estándar de conexión).',
    porQueImporta: 'El valor se mueve de "responder" a "hacer". Pero más autonomía = más riesgo si no hay límites, logs y aprobación humana.',
    accion: 'Empieza con agentes de bajo riesgo (reportes, investigación) y siempre con human-in-the-loop en acciones irreversibles.',
  },
  {
    id: 'mcp', fecha: '2026', titulo: 'MCP como "USB-C" de la IA', categoria: 'Agentes',
    resumen: 'El Model Context Protocol se volvió el estándar para conectar modelos con herramientas y datos.',
    porQueImporta: 'Reutilizas integraciones entre apps y agentes; menos pegamento a medida, más interoperabilidad.',
    accion: 'Aprende a conectar tus fuentes (Obsidian, Drive, Notion) vía MCP y expón solo lo necesario con permisos mínimos.',
  },
  {
    id: 'contexto', fecha: '2026', titulo: 'Ventanas de contexto enormes', categoria: 'Modelos',
    resumen: 'Context windows de cientos de miles a más de un millón de tokens.',
    porQueImporta: 'Puedes meter libros o bases enteras en una sola consulta, pero más contexto no es gratis: cuesta y puede diluir lo importante.',
    accion: 'Aun con contexto enorme, RAG sigue ganando en costo y trazabilidad para conocimiento que cambia.',
  },
  {
    id: 'multimodal', fecha: '2026', titulo: 'Multimodalidad por defecto', categoria: 'Modelos',
    resumen: 'Texto, imagen, audio y video en un mismo modelo, en tiempo casi real.',
    porQueImporta: 'Abre casos como analizar un plano, una foto de obra o una reunión hablada sin pipelines separados.',
    accion: 'Piensa tus flujos en "entradas mixtas": una foto + una pregunta puede reemplazar un formulario entero.',
  },
  {
    id: 'open-weight', fecha: '2026', titulo: 'Modelos open-weight competitivos', categoria: 'Modelos',
    resumen: 'Modelos con pesos abiertos cada vez más cerca de los cerrados, ejecutables localmente.',
    porQueImporta: 'Permiten privacidad, control de costos y edge AI; clave cuando los datos no pueden salir (obra, salud, legal).',
    accion: 'Evalúa open-weight cuando importe la privacidad o el costo a escala; cerrado cuando quieras lo último en capacidad.',
  },
  {
    id: 'vibe-coding', fecha: '2026', titulo: 'Vibe coding maduro', categoria: 'Productividad',
    resumen: 'Desarrollar dirigiendo IA (Codex, Claude Code, Cursor, v0) se volvió práctica común, no experimento.',
    porQueImporta: 'Acelera de idea a producto, pero sin spec ni revisión genera deuda técnica y bugs sutiles.',
    accion: 'Adopta el flujo: problema → spec → app → revisar código → probar → desplegar. La IA acelera, el criterio decide.',
  },
  {
    id: 'gobernanza', fecha: '2026', titulo: 'Regulación y seguridad en serio', categoria: 'Gobernanza',
    resumen: 'EU AI Act en aplicación por fases, estándares de procedencia (C2PA) y foco en prompt injection.',
    porQueImporta: 'Operar IA en producción ya implica cumplimiento, trazabilidad y seguridad, no solo capacidad técnica.',
    accion: 'Clasifica el riesgo de tus casos, protege PII y trata el prompt injection como amenaza real en agentes.',
  },
  {
    id: 'aec', fecha: '2026', titulo: 'IA aplicada a construcción (AEC)', categoria: 'AEC',
    resumen: 'Visión por computadora en obra, gemelos digitales y RAG sobre normas/BIM ganan tracción real.',
    porQueImporta: 'Es la ventaja competitiva concreta del ecosistema GEN+/VisionPro: datos propios de obra que nadie más tiene.',
    accion: 'Acumula dataset propio (cámaras, RFIs, normas): el modelo se copia, tus datos no.',
  },
];
