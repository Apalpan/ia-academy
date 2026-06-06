# IA Academy · Niveles 1–10

Aplicación web interactiva para **aprender Inteligencia Artificial** —terminología, conceptos y
herramientas de productividad— del **nivel 1 al 10**, con práctica adaptativa, glosario, quizzes,
XP/rachas y mapa de dominio. Pensada para maximizar el aprendizaje paso a paso.

> Contenido aterrizado en la base de conocimiento de **Alejandro Palpan** (vault Obsidian
> `AP_Knowledge_OS/05_KNOWLEDGE`: ruta de aprendizaje IA + glosario de términos).

**En vivo:** https://apalpan.github.io/ia-academy/

## Los 10 niveles

1. Fundamentos de IA (IA, ML, Deep Learning)
2. LLMs y modelos modernos (tokens, contexto, alucinaciones)
3. Asistentes y productividad (ChatGPT/Claude/Perplexity/NotebookLM, segundo cerebro)
4. Prompt Engineering (rol, few-shot, chain-of-thought, PromptOps)
5. RAG y bases de conocimiento (chunking, embeddings, vector DB, reranking)
6. Entrenamiento y evaluación (fine-tuning, LoRA, precision/recall/F1)
7. Agentes y herramientas (tool use, function calling, MCP, human-in-the-loop)
8. Automatización y vibe coding (n8n, webhooks, Codex/Claude Code/Cursor/v0)
9. IA aplicada: visión, datos y AEC (YOLO, IoU, edge AI, BIM, digital twin)
10. Gobernanza, seguridad y estrategia (MLOps, drift, prompt injection, ROI)

## Funcionalidades

- **Mapa de niveles** gamificado: superas un nivel con ≥70% para desbloquear el siguiente.
- **Reto del día**: rutina diaria (flashcards + quiz) para volverte experto con uso constante.
- **Flashcards con repetición espaciada (SM-2)**: cada concepto trae explicación, **analogía**, criterio clave, **buena práctica** y **dato curioso**.
- **Práctica por nivel** con feedback inmediato; cada respuesta enseña explicación + analogía + cuándo aplica + dato.
- **Prompts de aprendizaje al extremo**: biblioteca de meta-prompts (Feynman, active recall, primeros principios, debate socrático) con copiar.
- **Novedades / Tendencias IA**: digest curado con "por qué importa" y "qué hacer" (pensamiento crítico).
- **Quiz mixto**, **Glosario** buscable, **Progreso** (XP/rango/dominio) y **Repaso de errores**.
- Ejercicios variados: definición, término, aplicación, herramienta, V/F, "detecta el error".
- Optimización: rutas con lazy-load y respeto a "reducir animaciones".

## Stack

Vite + React 19 + TypeScript + Tailwind. Sin backend: el progreso se guarda en `localStorage`
(toda la app habla con `src/ia/engine/persistence.ts`, fácil de migrar a backend).

## Cómo correr

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # producción en dist/
npm run preview    # sirve el build
npm run validate   # QA del banco + engines (sin navegador)
npm run smoke      # smoke test de UI en Edge/Chrome del sistema
```

## Arquitectura

```
src/ia/
  types.ts            # modelo de dominio (Question, Attempt, ProgressSnapshot, niveles, XP, ranks)
  levels.ts           # los 10 niveles (conceptos + herramientas)
  glossary.ts         # glosario (desde el vault)
  data/               # banco de ejercicios por nivel (+ índice)
  engine/             # questionBank, progress (mastery/XP/desbloqueo), session, persistence
  state.tsx           # ProfileProvider + useProfile()
  ui/                 # router, primitivas, QuestionRunner, SessionSummary, AppShell, pages/
  IaApp.tsx           # raíz: provider + router + shell
```

**Expandir el banco:** agrega objetos `Question` en `src/ia/data/levels-*.ts` con su `level` (1–10).
Corre `npm run validate` para verificar consistencia. El motor los usa automáticamente.

## Despliegue

GitHub Pages (rama `gh-pages`, `base: './'`, router por hash → sin rewrites):

```bash
npm run build && npx gh-pages -d dist
```
