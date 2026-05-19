FROM python:3.12-slim

WORKDIR /app

# Prevent Python from buffering stdout/stderr
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["PYTHONPATH=. fastapi dev app/api/main.py", "--host", "0.0.0.0", "--port", "8000", "--reload"]