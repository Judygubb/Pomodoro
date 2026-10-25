FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Note: point to 'timer:app' if your file is named timer.py and your FastAPI instance is named app
CMD ["uvicorn", "timer:app", "--host", "0.0.0.0", "--port", "8001"]