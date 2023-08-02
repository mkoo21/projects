The docker compose files will provide some basic setup.

## CLI snippets basics

### Start up the kafka server standalone (for testing)
Use the config file `docker-compose-kafka.yml` with docker-compose up.


### Run a command in the kafka server

```
docker run -it --rm \
    --network app-tier \
    bitnami/kafka:latest kafka-topics.sh --list  --bootstrap-server kafka:9092
```

### Create topic

```
bin/kafka-topics.sh --create --topic django-events --bootstrap-server kafka:9092
```

### Write events to topic (Involves writing to stdin)

```
$ bin/kafka-console-producer.sh --topic django-events --bootstrap-server kafka:9092
This is my first event
This is my second event
```

### Read events from topic

```
bin/kafka-console-consumer.sh --topic django-events --from-beginning --bootstrap-server kafka:9092
```

### Run django server (target is the manage.py in mysite directory, you should cd there or change the path.

```
python manage.py runserver
```
