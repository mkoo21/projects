import sys, logging

from django.http import HttpResponse
from kafka import KafkaConsumer, KafkaProducer

TOPIC_NAME = "django-events"
KAFKA_PORT = 9092

# Should gate these under something like "DEV_ENV=LOCAL"
# KAFKA_SERVER_HOSTNAME = "kafka" # 
KAFKA_SERVER_HOSTNAME = "localhost" # use this instead when running django on localhost instead of docker 
KAFKA_BOOTSTRAP_SERVERS=[f"{KAFKA_SERVER_HOSTNAME}:{KAFKA_PORT}"]

# log_level = logging.DEBUG
# logging.basicConfig(level=log_level)
# log = logging.getLogger('kafka')
# log.setLevel(log_level)

producer = KafkaProducer(bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS)

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


def create(request):
    future = producer.send('django-events', request.body).get(timeout=90)
    producer.flush()
    
    return HttpResponse(f"Logging event with text {request.body}/nResult: {future}")
    
    
def consume(request):
    consumer = KafkaConsumer(
        TOPIC_NAME,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        auto_offset_reset='earliest',
        consumer_timeout_ms=5000)
    response = ""
    for msg in consumer:
        # print(f"message offset: {msg.offset}/nmessage: {str(msg.value)}\n")
        response = response + " " + str(msg.value)
    return HttpResponse(response)
