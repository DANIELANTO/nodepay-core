FROM python:3.11-slim

WORKDIR /app

# Copiamos primero los requirements para aprovechar el caché de Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código
COPY . .

EXPOSE 8000

# Usamos Uvicorn con --reload para tener hot-reload como con Nodemon
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]