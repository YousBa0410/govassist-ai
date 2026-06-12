<h3 style="color:orange;">Overview</h3>

GovAssist AI is an intelligent e-Government assistant designed for Côte d'Ivoire.

It helps users:

- Understand taxes (VAT, CNPS, fiscal rules)
- Interact with an AI-powered government assistant 
- Trigger backend tools via MCP architecture 
- Communicate in French & English automatically

Built as a full-stack AI system combining LLM reasoning + tool execution.

- Key Features 
- Tax assistance (VAT, contributions, deadlines)
- Bilingual AI (FR / EN auto-detection)
- MCP Tool Execution (function calling system)
- Mistral AI integration
- Fully containerized with Docker


<h5>System Design</h5>

1. Frontend (React)
   Chat UI
   Conversation management
   Tool execution visualization
   Error handling UX layer
2. Backend (FastAPI MCP Server)
   Natural language processing router
   Tool selection engine
   MCP orchestration layer
   API abstraction layer
3. Tools Layer

Implemented MCP tools:

get_country_profile
calculate_vat
get_tax_deadlines
calculate_social_contributions
get_economic_indicators

Each tool is:

stateless
validated (Pydantic)
independently testable


🐳 Docker Architecture

    docker-compose
    services:
    backend:
    build: ./backend
    ports:
    - "8000:8000"
    
    frontend:
    build: ./frontend
    ports:
    - "3000:3000"

⚙️ Installation (Local Setup)

1. Clone repo
   git clone https://github.com/your-repo/egovassist-ai.git
   cd egovassist-ai

2. Backend setup

   cd backend

   python -m venv venv

   source venv/bin/activate

   pip install -r requirements.txt

Create .env:

    MISTRAL_API_KEY=your_key_here

Run backend:

    uvicorn app.main:app --reload --port 8000

3. Frontend setup
   cd frontend

   npm install

   npm start

<h3>Deployment</h4>

   Frontend (Vercel)

   Connected to GitHub

   Auto-deploy on push

   Environment variable:

    REACT_APP_BACKEND_URL=https://govassist-ai.onrender.com

   Backend (Render)

   Docker-based deployment

   Exposes FastAPI on port 8000

   Auto-deploy from GitHub

   Environment Variables

   Variable	Description

   MISTRAL_API_KEY	API key for LLM orchestration

   BACKEND_URL	Frontend backend endpoint

   🧠 MCP Design Decisions

   Why MCP?

We chose MCP (Model Context Protocol) because:

It standardizes tool execution

Separates reasoning from execution

Allows scalable tool orchestration

Enables multi-tool chaining

Tool Design Philosophy

Each tool is:

    Single responsibility
    
    Stateless
    
    JSON schema validated
    
    Independent from LLM logic

<h3>calability Plan</h3>

- 100 users -> Single backend instance -> No caching required
- 10,000 users -> Add Redis caching layer -> Async job processing (Celery)
- 100,000 users -> Kubernetes deployment -> Load balancing (NGINX) -> Distributed MCP workers

📸 Screenshots

👉 Add here:

![Capture d’écran du 2026-06-12 11-40-29.png](images/Capture%20d%E2%80%99%C3%A9cran%20du%202026-06-12%2011-40-29.png)
![Capture d’écran du 2026-06-12 11-42-09.png](images/Capture%20d%E2%80%99%C3%A9cran%20du%202026-06-12%2011-42-09.png)
![Capture d’écran du 2026-06-12 11-43-27.png](images/Capture%20d%E2%80%99%C3%A9cran%20du%202026-06-12%2011-43-27.png)
![Capture d’écran du 2026-06-12 11-50-57.png](images/Capture%20d%E2%80%99%C3%A9cran%20du%202026-06-12%2011-50-57.png)
![Capture d’écran du 2026-06-12 11-51-17.png](images/Capture%20d%E2%80%99%C3%A9cran%20du%202026-06-12%2011-51-17.png)Chat UI


👨‍💻 Author

Built as a technical assessment for Liwaza (AI for public services in Africa)

📦 Status

✅ Backend MCP server

✅ Frontend React client

✅ Dockerized setup

✅ Deployed (Vercel + Render)

⚠️ Using simulated government APIs (MVP stage)