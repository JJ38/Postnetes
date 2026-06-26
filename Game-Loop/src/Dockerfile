FROM python:3.11-slim

WORKDIR /app

RUN pip install requests

COPY traffic_generator.py .

CMD ["python", "traffic_generator.py"]