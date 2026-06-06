// ============================================================================
// Los 10 niveles — derivados de la "Ruta de aprendizaje IA" del vault de AP.
// De fundamentos a gobernanza/estrategia.
// ============================================================================
import type { LevelDef, LevelId } from './types';

export const LEVELS: LevelDef[] = [
  {
    id: 1,
    titulo: 'Fundamentos de IA',
    subtitulo: 'Qué es IA, ML y Deep Learning',
    meta: 'Explicar qué es la IA y cómo aprende un modelo desde datos.',
    conceptos: ['Inteligencia Artificial', 'Machine Learning', 'Deep Learning', 'Red neuronal', 'Dataset', 'Parámetro', 'Entrenamiento', 'Inferencia', 'Overfitting'],
    herramientas: ['Python', 'Jupyter', 'Google Colab'],
    icon: 'Brain',
  },
  {
    id: 2,
    titulo: 'LLMs y modelos modernos',
    subtitulo: 'Cómo funcionan los modelos de lenguaje',
    meta: 'Entender tokens, contexto, temperatura y por qué un LLM alucina.',
    conceptos: ['LLM', 'Token', 'Tokenización', 'Embedding', 'Transformer', 'Attention', 'Context window', 'Temperature', 'IA generativa', 'Multimodal', 'Alucinación'],
    herramientas: ['ChatGPT', 'Claude', 'Gemini'],
    icon: 'Sparkles',
  },
  {
    id: 3,
    titulo: 'Asistentes y productividad',
    subtitulo: 'Usar IA como sistema de trabajo',
    meta: 'Elegir el asistente correcto y montar tu "segundo cerebro".',
    conceptos: ['Asistente de IA', 'Contexto', 'Comparar respuestas', 'Segundo cerebro', 'Investigación con citas', 'Captura → nota permanente'],
    herramientas: ['ChatGPT', 'Claude', 'Perplexity', 'NotebookLM', 'Microsoft Copilot', 'Obsidian', 'Notion', 'Zotero'],
    icon: 'Rocket',
  },
  {
    id: 4,
    titulo: 'Prompt Engineering',
    subtitulo: 'Diseñar instrucciones que funcionan',
    meta: 'Construir prompts con rol, contexto, formato y ejemplos; versionarlos.',
    conceptos: ['Prompt', 'System instruction', 'Few-shot', 'Chain-of-thought', 'Rol y contexto', 'Formato de salida', 'PromptOps', 'Self-consistency'],
    herramientas: ['ChatGPT', 'Claude', 'Google AI Studio'],
    icon: 'MessageSquareCode',
  },
  {
    id: 5,
    titulo: 'RAG y bases de conocimiento',
    subtitulo: 'Que el modelo responda con TUS documentos',
    meta: 'Diseñar un RAG: chunking, embeddings, vector DB y reranking.',
    conceptos: ['RAG', 'Retriever', 'Vector database', 'Chunking', 'Embedding', 'Reranking', 'Semantic search', 'Hybrid search'],
    herramientas: ['NotebookLM', 'Vector DB', 'Supabase'],
    icon: 'Database',
  },
  {
    id: 6,
    titulo: 'Entrenamiento y evaluación',
    subtitulo: 'Fine-tuning, métricas y datos',
    meta: 'Saber cuándo entrenar/ajustar y cómo medir un modelo.',
    conceptos: ['Fine-tuning', 'LoRA', 'Quantization', 'Distillation', 'Train/test split', 'Validación cruzada', 'Accuracy', 'Precision', 'Recall', 'F1-score', 'Overfitting'],
    herramientas: ['Python', 'Colab', 'GPU'],
    icon: 'Gauge',
  },
  {
    id: 7,
    titulo: 'Agentes y herramientas',
    subtitulo: 'IA que planifica y ejecuta',
    meta: 'Entender agentes, tool use, function calling y MCP con controles.',
    conceptos: ['Agente IA', 'Tool use', 'Function calling', 'MCP', 'Planificación', 'Memoria', 'Human-in-the-loop', 'Guardrail'],
    herramientas: ['Claude', 'MCP', 'AgentFlow'],
    icon: 'Bot',
  },
  {
    id: 8,
    titulo: 'Automatización y vibe coding',
    subtitulo: 'Construir flujos y software con IA',
    meta: 'Automatizar procesos y dirigir IA para crear software con criterio.',
    conceptos: ['Vibe coding', 'Webhook', 'API', 'Workflow', 'Spec → app → deploy', 'Revisar código'],
    herramientas: ['n8n', 'Make', 'Zapier', 'Codex', 'Claude Code', 'Cursor', 'v0', 'Vercel'],
    icon: 'Workflow',
  },
  {
    id: 9,
    titulo: 'IA aplicada: visión, datos y AEC',
    subtitulo: 'Computer vision, BIM y dashboards',
    meta: 'Aplicar IA a imágenes, datos y construcción (caso VisionPro/GEN+).',
    conceptos: ['Computer Vision', 'Detección de objetos', 'YOLO', 'mAP', 'IoU', 'Edge AI', 'BIM', 'CDE', 'Digital Twin', 'ETL', 'KPI', 'Dashboard'],
    herramientas: ['YOLO', 'VisionPro', 'Streamlit', 'Power BI'],
    icon: 'ScanEye',
  },
  {
    id: 10,
    titulo: 'Gobernanza, seguridad y estrategia',
    subtitulo: 'IA responsable y con ROI',
    meta: 'Operar IA en producción de forma segura, ética y rentable.',
    conceptos: ['MLOps', 'Drift', 'Observability', 'Prompt injection', 'Guardrail', 'PII', 'Data governance', 'EU AI Act', 'C2PA', 'ROI', 'TCO', 'Ventaja competitiva'],
    herramientas: ['Observability', 'Audit log', 'Access control'],
    icon: 'ShieldCheck',
  },
];

const levelMap = new Map(LEVELS.map((l) => [l.id, l]));
export const getLevel = (id: LevelId): LevelDef => levelMap.get(id)!;
export const levelTitle = (id: LevelId): string => levelMap.get(id)?.titulo ?? `Nivel ${id}`;
