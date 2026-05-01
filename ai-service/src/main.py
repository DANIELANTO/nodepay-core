from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware

# LangChain components
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.documents import Document

from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain.agents import create_sql_agent

load_dotenv()

app = FastAPI(title="NodePay AI Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de Pydantic para validar la entrada del usuario
class QuestionRequest(BaseModel):
    question: str

# Variables globales
rag_chain = None
semantic_cache = None
embeddings_model = None

sql_agent = None

@app.on_event("startup")
def initialize_rag():
    global rag_chain, semantic_cache, embeddings_model, sql_agent
    try:
        print("🧠 Inicializando el cerebro RAG y Caché Semántico...")
        
        # Cargar el documento
        loader = TextLoader("docs/terms_and_conditions.txt", encoding="utf-8")
        docs = loader.load()

        # Dividir el texto en fragmentos manejables (Chunks)
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_documents(docs)

        # Crear Embeddings y guardarlos en la base de datos vectorial FAISS
        embeddings_model = OpenAIEmbeddings()
        vectorstore = FAISS.from_documents(chunks, embeddings_model)
        retriever = vectorstore.as_retriever(search_kwargs={"k": 10})

        # Configurar el LLM
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

        # Configurar el Agente SQL
        print("Conectando el Agente SQL a PostgreSQL...")
        raw_url = os.environ.get("DATABASE_URL")
        
        schema = None
        if "?" in raw_url:
            base_url, query = raw_url.split("?", 1)
            raw_url = base_url
            if "schema=" in query:
                import urllib.parse
                qs = urllib.parse.parse_qs(query)
                if "schema" in qs:
                    schema = qs["schema"][0]
                    
        db_url = raw_url.replace("postgresql://", "postgresql+psycopg2://")
        engine_args = {}
        if schema:
            engine_args = {
                "connect_args": {
                    "options": f"-c search_path={schema}"
                }
            }

        db = SQLDatabase.from_uri(
            db_url, 
            schema=schema if schema else None,
            sample_rows_in_table_info=1,
            engine_args=engine_args
        )

        toolkit = SQLDatabaseToolkit(db=db, llm=llm)

        # Agente recibe el LLM y las toolkits para leer la BD
        schema_name = schema or 'public'
        custom_prefix = f"""
        You are an expert, strict Data Analyst for NodePay.
        Your ONLY job is to query the PostgreSQL database to answer questions about users, wallets, balances, and financial transactions.
        
1. If the user asks about ANYTHING unrelated to NodePay (e.g., food, math, general knowledge, jokes), you must refuse to answer and reply EXACTLY with: "I am a financial assistant. I can only answer questions related to NodePay data."
        2. NEVER return passwords, hashes, database credentials, ids, uuids, or API keys under ANY circumstances, even if explicitly requested.
        3. Never execute DML operations (INSERT, UPDATE, DELETE, DROP). You are READ-ONLY.
        4. SYNTAX CRITICAL: Because this database uses Prisma, table and column names are case-sensitive (e.g., "User", "isActive"). You MUST wrap them in raw double quotes.
        5. SCHEMA CRITICAL: The tables are located in the schema "{schema_name}". 
           You MUST prepend this schema name to ALL table names in your SQL queries.
           WRONG: SELECT COUNT(*) FROM "User";
           RIGHT: SELECT COUNT(*) FROM {schema_name}."User";
           HOWEVER, when using the `sql_db_schema` tool, pass ONLY the exact table name exactly as output by `sql_db_list_tables` (e.g. "User", NOT "{schema_name}.User").
        """

        # Pasamos el prefijo al agente
        sql_agent = create_sql_agent(
            llm=llm, 
            toolkit=toolkit, 
            verbose=True,
            agent_type="openai-tools",
            prefix=custom_prefix,
            max_iterations=8,
        )
        print("Agente SQL inicializado correctamente.")
        
        # Configurar el Prompt
        system_prompt = (
            "You are the official AI assistant for NodePay. Your ONLY purpose is to answer questions based on the provided official documentation. "
            "Use the following pieces of retrieved context to answer the user's question. "
            "CRITICAL RULES: "
            "1. If the user asks about a topic, and there is ANY mention of that topic in the context, you must answer by providing the relevant information from the context. "
            "2. If the topic is entirely absent from the context, or if the user asks about completely unrelated topics (e.g., food, math, general knowledge), you must explicitly state that you do not know the answer. "
            "3. Never try to make up an answer, guess, or use outside knowledge. Honesty is your top priority. "
            "Context: {context}"
        )
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
        ])

        # Ensamblar la Cadena (Chain)
        question_answer_chain = create_stuff_documents_chain(llm, prompt)
        rag_chain = create_retrieval_chain(retriever, question_answer_chain)

        dummy_doc = Document(page_content="dummy_startup", metadata={"answer": "dummy"})
        semantic_cache = FAISS.from_documents([dummy_doc], embeddings_model)
        print("✅ RAG inicializado correctamente.")
        
    except Exception as e:
        print(f"❌ Error inicializando RAG: {e}")

@app.get("/health")
def health_check():
    return {"status": "up", "service": "ai-assistant", "framework": "FastAPI"}

@app.post("/ask")
async def ask_question(req: QuestionRequest):
    if rag_chain is None or semantic_cache is None:
        raise HTTPException(status_code=500, detail="RAG system is not initialized")
    
    results = semantic_cache.similarity_search_with_score(req.question, k=1)
    best_match, score = results[0]
    if best_match.page_content != "dummy_startup" and score < 0.05:
        print(f"CACHE HIT! Ahorrando tokens. Score de similitud: {score}")
        return {
            "question": req.question,
            "answer": best_match.metadata["answer"],
            "cached": True
        }

    print("CACHE MISS. Consultando a OpenAI...")

    # Invocacion de la cadena con la pregunta del usuario
    response = rag_chain.invoke({"input": req.question})

    final_answer = response["answer"]

    new_cache_entry = Document(page_content=req.question, metadata={"answer": final_answer})
    semantic_cache.add_documents([new_cache_entry])
    
    return {
        "question": req.question,
        "answer": response["answer"],
        "cached": False
    }

@app.post("/data-insights")
async def data_insights(req: QuestionRequest):
    if sql_agent is None:
        raise HTTPException(status_code=500, detail="SQL Agent is not initialized")
    print(f"Agente analizando la base de datos para: {req.question}")

    try:
        response = sql_agent.invoke({"input": req.question})
    
        return {
            "question": req.question,
            "insight": response["output"]
        }
    except Exception as e:
        print(f"Error en el agente SQL: {e}")
        raise HTTPException(status_code=500, detail="Error procesando la consulta de datos")