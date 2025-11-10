# R3almN8N

[![GitHub Repo stars](https://img.shields.io/github/stars/R3almN8N/R3almN8N?style=social)](https://github.com/R3almN8N/R3almN8N)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5-orange.svg)](https://vitejs.dev/)

R3almN8N is an open-source, self-hosted workflow automation tool inspired by n8n. It features a visual drag-and-drop editor for building workflows, a robust backend engine for execution, and extensible nodes for integrations (e.g., HTTP, email, AI via LangChain). Designed for developers, it's modular, scalable, and AI-ready—perfect for devops, marketing automations, or RAG-based chatbots.

This is an MVP in active development (as of November 2025). Built with a small team mindset: lightweight, TypeScript-first, and deployable via Docker. Expect 20+ core integrations in v1.0.

## ✨ Features

- **Visual Workflow Builder**: Drag-and-drop nodes with React Flow; real-time testing, undo/redo, and template imports.
- **Extensible Node System**: Triggers (webhook/CRON), actions (HTTP/DB), logic (if/else/loops), and AI nodes (prompts, embeddings).
- **Execution Engine**: Sequential/parallel runs with BullMQ queues, retries, error handling, and WebSockets for status updates.
- **Integrations**: 20+ starters (OAuth for Google/Slack, REST APIs); marketplace for custom plugins.
- **Multi-Tenancy & Security**: Supabase auth (JWT/RBAC), data isolation, audit logs.
- **Deployment Options**: Self-hosted (Docker/K8s), hybrid SaaS; scheduling via CRON.
- **AI Depth**: LangChain for agentic flows, vector DBs (Pinecone), multimodal support (e.g., Stable Diffusion).
- **Pro UI**: Responsive nav (mega-dropdowns, hamburger), Tailwind styling, Framer Motion anims, dark mode.

| Feature | Status | Notes |
|---------|--------|-------|
| Visual Editor | ✅ MVP | React Flow + zoom/debug |
| Core Engine | ✅ MVP | BullMQ + sequential exec |
| Nodes/Integrations | 🔄 In Progress | 20+; AI stubs ready |
| Scheduling/Triggers | ✅ Basic | CRON via BullMQ |
| Multi-Tenancy | ✅ Basic | Supabase RLS |
| Marketplace | 📋 Planned | User-submitted nodes |

## 🛠 Tech Stack

- **Frontend**: React 18+ (TS, hooks), Vite (fast HMR), React Flow (editor), Tailwind CSS (styling), Framer Motion (anims), Lucide/Heroicons (icons).
- **Backend**: Node.js/Express (API), BullMQ + Redis (queues/engine), Supabase (Postgres DB + auth).
- **DevOps**: Docker Compose (local stack), GitHub Actions (CI/CD), Prometheus/Grafana (monitoring stub).
- **AI/Ext**: LangChain (agents), OpenAI/Claude APIs (prompts), Pinecone (vectors).
- **Tools**: TypeScript (typesafety), Yarn/PNPM (deps), VSCode (Mac OSX optimized).

No heavy frameworks—keeps it lightweight (~50MB Docker image).

## 🚀 Quick Start

### Prerequisites
- Node.js ≥20
- Docker (for local Supabase/Redis)
- Yarn/PNPM (or npm)
- Supabase account (free tier: create project for DB/auth)

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/R3almN8N/R3almN8N.git
   cd R3almN8N
   ```

2. Set up environment:
   - Copy `.env.example` to `.env` and fill Supabase creds:
     ```
     SUPABASE_URL=postgresql://postgres:[YOUR_PW]@db.[PROJECT].supabase.co:5432/postgres
     SUPABASE_ANON_KEY=eyJ...  # From Supabase dashboard
     REDIS_URL=redis://localhost:6379
     PORT=3001
     ```
   - Init Supabase table (run in dashboard SQL editor):
     ```sql
     CREATE TABLE workflows (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       name TEXT NOT NULL,
       nodes JSONB NOT NULL DEFAULT '[]',
       connections JSONB NOT NULL DEFAULT '[]',
       active BOOLEAN DEFAULT true,
       created_at TIMESTAMP DEFAULT NOW()
     );
     ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;  -- For multi-tenancy
     ```

3. Start local stack:
   ```bash
   docker-compose up -d  # Starts Redis + Postgres (Supabase local equiv)
   ```

4. Install & run backend:
   ```bash
   cd backend
   yarn install  # Or pnpm i
   yarn dev      # Runs on http://localhost:3001
   ```

5. Install & run frontend:
   ```bash
   cd ../frontend
   yarn install
   yarn dev      # Runs on http://localhost:5173 (proxies /api to backend)
   ```

6. Open http://localhost:5173 in browser. Create a workflow, run it—check console/Supabase for results!

### Docker Production
For self-hosted prod:
```bash
# Build & run full stack
docker-compose -f docker-compose.prod.yml up -d
# Or K8s: See k8s/ dir (planned)
```

## 📖 Usage

1. **Create Workflow**: Via UI—add nodes (e.g., trigger → HTTP action → AI prompt).
2. **Nodes JSON Example** (Stored in Supabase):
   ```json
   {
     "id": "wf-1",
     "name": "Email Alert",
     "nodes": [
       { "id": "n1", "type": "trigger", "name": "Schedule", "data": { "cron": "0 9 * * *" } },
       { "id": "n2", "type": "action", "name": "HTTP", "data": { "url": "https://api.example.com" } },
       { "id": "n3", "type": "ai", "name": "Summarize", "data": { "prompt": "Summarize: {{input}}" } }
     ],
     "connections": [{ "from": "n1", "to": "n2" }, { "from": "n2", "to": "n3" }]
   }
   ```
3. **Execute**: POST `/api/workflows/:id/execute` with `{ input: {} }`—returns context output.
4. **Custom Nodes**: Develop as TS modules (see `backend/src/nodes/` starter); npm install for plugins.
5. **AI Setup**: Add `OPENAI_API_KEY` to `.env`; extend `executor.ts` for LangChain.

For full API docs: Run `yarn docs` (planned: Swagger integration).

## 🏗 Architecture Overview

- **Frontend** (`frontend/`): Vite React app—editor (React Flow), nav (mega-menu), hooks (useWorkflow).
- **Backend** (`backend/`): Express API—routes (workflows), engine (executor.ts with BullMQ), models (Supabase).
- **Data**: Supabase (workflows JSONB), Redis (queues/caching).
- **Flow**: UI → API save → Queue job → Node exec → WebSocket update.

See [blueprint.md](blueprint.md) for build guide (Steps 1-8 from n8n-inspired plan).

![Architecture Diagram](https://via.placeholder.com/800x400?text=Architecture+Diagram) <!-- Replace with draw.io export -->

## 🤝 Contributing

1. Fork & clone.
2. Create feature branch: `git checkout -b feat/amazing-node`.
3. Commit: Use conventional commits (`feat: add AI node`).
4. Push & PR—include tests (Jest planned).
5. Run tests: `yarn test` (MVP: manual via UI).

Guidelines: TS strict, ESLint/Prettier, no breaking changes without deprecation.

## 📄 License

MIT © 2025 R3almN8N. See [LICENSE](LICENSE) for details.

## 🚧 Roadmap

- v0.2: Full React Flow editor + 50 nodes.
- v0.3: AI marketplace + K8s deploy.
- v1.0: SaaS hybrid + monitoring.

Questions? Open an issue or ping @R3almN8N on X. Star/fork to support! ⭐

---

**Summary Change Log (Initial Commit for README)**
- Added: `README.md` - Full project docs with badges, features table, quick start, usage examples, architecture overview, contributing guide, and roadmap.
- Fixed: N/A (new file).
- Commit msg: "docs: add comprehensive README.md with setup and features #3"
