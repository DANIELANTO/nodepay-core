# AI Service

> **Intelligent Assistant Engine** for NodePay — built with Python, FastAPI, LangChain, and OpenAI GPT-4o-mini.

Part of the [NodePay](../README.md) microservices platform.

---

## Table of Contents

- [Responsibility](#responsibility)
- [Tech Stack](#tech-stack)
- [Architecture & AI Design](#architecture--ai-design)
  - [RAG Pipeline — `/ask` endpoint](#1-rag-pipeline----ask-endpoint)
  - [SQL Agent — `/data-insights` endpoint](#2-sql-agent----data-insights-endpoint)
  - [Semantic Cache](#semantic-cache)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Adding Knowledge Base Documents](#adding-knowledge-base-documents)
- [Security & Guardrails](#security--guardrails)

---

## Responsibility

The AI service provides **two distinct AI-powered capabilities**:

1. **Terms & Conditions Q&A (`/ask`)** — Answers user questions exclusively from the official NodePay documentation using a RAG (Retrieval-Augmented Generation) pipeline. Never hallucinates — if the answer is not in the document, the AI says so.

2. **Live Data Insights (`/data-insights`)** — A read-only SQL Agent that introspects the live PostgreSQL database to answer analytical questions about users, wallets, balances, and financial transactions in natural language.

---

## Tech Stack

| Technology | Role |
|---|---|
| **Python 3.x** | Runtime |
| **FastAPI 0.109** | Async HTTP framework |
| **Uvicorn 0.27** | ASGI server |
| **LangChain 0.1.4** | LLM orchestration framework |
| **`langchain-openai`** | OpenAI integration (embeddings + chat) |
| **`langchain-community`** | Community integrations (FAISS, SQL, loaders) |
| **OpenAI GPT-4o-mini** | Large Language Model for generation |
| **OpenAI Embeddings** | Text vectorization for semantic search |
| **FAISS** | In-memory vector store for RAG and semantic cache |
| **SQLAlchemy 2.0** | Database engine for SQL Agent |
| **psycopg2** | PostgreSQL driver |
| **`python-dotenv`** | Environment variable management |

---

## Architecture & AI Design

### 1. RAG Pipeline — `/ask` endpoint

**RAG (Retrieval-Augmented Generation)** ensures the AI answers only from verified, trusted documentation — making it accurate and grounded.

```
                    ┌─────────────────────────────────────────┐
                    │         APPLICATION STARTUP              │
                    │                                         │
                    │  Load docs/terms_and_conditions.txt     │
                    │         ↓                               │
                    │  Split into chunks (500 tokens,         │
                    │  50-token overlap)                      │
                    │         ↓                               │
                    │  Vectorize with OpenAI Embeddings       │
                    │         ↓                               │
                    │  Store in FAISS vector index            │
                    └─────────────────────────────────────────┘

                    ┌─────────────────────────────────────────┐
                    │           REQUEST FLOW (/ask)           │
                    │                                         │
                    │  User question                          │
                    │         ↓                               │
                    │  Check Semantic Cache (FAISS)           │
                    │         ↓ score < 0.15 → CACHE HIT      │
                    │         ↓ score ≥ 0.15 → CACHE MISS     │
                    │         ↓                               │
                    │  Search FAISS vector store              │
                    │  (top-2 most relevant chunks)           │
                    │         ↓                               │
                    │  Build prompt: system + context + input │
                    │         ↓                               │
                    │  GPT-4o-mini generates answer           │
                    │         ↓                               │
                    │  Store Q+A in Semantic Cache            │
                    │         ↓                               │
                    │  Return answer                          │
                    └─────────────────────────────────────────┘
```

**LangChain components used:**
- `TextLoader` — loads the `.txt` knowledge base document
- `RecursiveCharacterTextSplitter` — chunks text into overlapping segments
- `OpenAIEmbeddings` — converts text to vector representations
- `FAISS` — stores and searches vectors
- `ChatPromptTemplate` — structures the system + user prompt
- `create_stuff_documents_chain` — combines retrieved chunks into the prompt
- `create_retrieval_chain` — ties the retriever to the QA chain

---

### 2. SQL Agent — `/data-insights` endpoint

The SQL Agent uses LangChain's `create_sql_agent` to dynamically generate and execute safe SQL queries against the live database.

```
User natural-language question
        ↓
LangChain SQL Agent (openai-tools type)
        ↓
Agent "thinks": inspects table schemas, generates SQL
        ↓
SQLDatabaseToolkit executes SELECT query via SQLAlchemy
        ↓
Agent interprets results and formulates a natural answer
        ↓
Return answer as JSON
```

**System prompt enforces strict guardrails:**
- Only `SELECT` queries — no INSERT, UPDATE, DELETE, or DROP
- Explicit schema prefix required on all table names (`public."User"`)
- Case-sensitive quoting required (Prisma generates PascalCase table names)
- Automatically refuses off-topic questions
- Never exposes passwords, hashes, UUIDs, or API keys

---

### Semantic Cache

The semantic cache is a second FAISS index that stores **previous question-answer pairs**.

Before calling the LLM, the service checks if a semantically similar question was already answered:

```python
results = semantic_cache.similarity_search_with_score(question, k=1)
best_match, score = results[0]

if score < 0.15:   # Cosine distance threshold
    return cached_answer  # Skip the LLM call entirely
```

**Why this matters:**
- Saves OpenAI API tokens for frequently repeated questions
- Dramatically reduces latency for cache hits
- Works across semantically equivalent phrasings, not just exact matches

The cache is **in-memory** (FAISS) and resets on service restart. A future improvement could persist it to disk or Redis.

---

## API Reference

Base URL: `http://localhost:8000`

Interactive docs available at [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI, auto-generated by FastAPI).

---

### `GET /health`

Returns service health status.

**Response:**
```json
{
  "status": "up",
  "service": "ai-assistant",
  "framework": "FastAPI"
}
```

---

### `POST /ask`

Ask the AI about NodePay's Terms & Conditions.

**Request Body:**
```json
{ "question": "What are the fees for international transactions?" }
```

**Response (cache miss):**
```json
{
  "question": "What are the fees for international transactions?",
  "answer": "According to the Terms and Conditions, international transactions...",
  "cached": false
}
```

**Response (cache hit):**
```json
{
  "question": "Tell me about fees for international transfers",
  "answer": "According to the Terms and Conditions, international transactions...",
  "cached": true
}
```

**Error (503):** Returned if the RAG system failed to initialize at startup.

---

### `POST /data-insights`

Ask analytical questions about the live database.

**Request Body:**
```json
{ "question": "How many active users are there and what is the total balance?" }
```

**Response:**
```json
{
  "question": "How many active users are there and what is the total balance?",
  "insight": "There are 42 active users with a combined wallet balance of $125,430.00 USD."
}
```

**Off-topic question response:**
```json
{
  "insight": "I am a financial assistant. I can only answer questions related to NodePay data."
}
```

---

## Project Structure

```
ai-service/
├── Dockerfile                  # Python container image
├── .dockerignore
├── .env                        # Environment variables (not committed)
├── requirements.txt            # Python dependencies
├── src/
│   └── main.py                 # FastAPI application (all routes + AI logic)
└── docs/
    └── terms_and_conditions.txt  # Knowledge base for the RAG pipeline
```

---

## Local Development

```bash
# From the ai-service/ directory

# 1. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate     # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 4. Start the development server with auto-reload
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The service will be available at `http://localhost:8000`.  
Swagger docs: `http://localhost:8000/docs`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | ✅ | Your OpenAI API key (for embeddings + GPT-4o-mini) |
| `DATABASE_URL` | ✅ | PostgreSQL URL for the SQL Agent. Format: `postgresql://user:pass@host:5432/db?schema=public` |
| `FRONTEND_URL` | ✅ | Allowed CORS origin (e.g., `http://localhost:5173`) |

---

## Adding Knowledge Base Documents

The RAG pipeline reads from `docs/terms_and_conditions.txt`. To update the knowledge base:

1. Edit or replace `docs/terms_and_conditions.txt`
2. Restart the service — the RAG index is rebuilt automatically on startup
3. The semantic cache is cleared on restart, forcing fresh answers from the new content

To add **multiple documents**, modify the `initialize_rag()` function in `src/main.py`:

```python
# Load multiple files
loaders = [
    TextLoader("docs/terms_and_conditions.txt"),
    TextLoader("docs/faq.txt"),
]
docs = []
for loader in loaders:
    docs.extend(loader.load())
```

---

## Security & Guardrails

| Guardrail | Implementation |
|---|---|
| **Topic restriction (RAG)** | System prompt instructs the LLM to only use retrieved context; refuses off-topic questions |
| **Topic restriction (SQL Agent)** | Strict prefix prompt that refuses non-NodePay questions |
| **Read-only SQL** | Prompt explicitly forbids DML — agent only generates SELECT queries |
| **No sensitive data exposure** | Prompt instructs agent to never return passwords, hashes, UUIDs, or API keys |
| **CORS** | Only the configured `FRONTEND_URL` origin is allowed |
| **Max iterations** | SQL agent limited to 8 reasoning iterations to prevent runaway loops |
| **Semantic accuracy** | RAG uses only 2 retrieved chunks — enough for accurate answers without drifting |
