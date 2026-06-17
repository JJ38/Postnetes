FROM python:3.11-slim

WORKDIR /app

RUN pip install flask

COPY standard_worker.py .

EXPOSE 5000

CMD ["python", "standard_worker.py"]