FROM python:3.11

# Build the image for the django app
RUN python3 -m venv /opt/venv
WORKDIR /usr/src/app
COPY . .

RUN /opt/venv/bin/pip install -r requirements.txt

WORKDIR mysite

EXPOSE 8000
CMD ["/opt/venv/bin/python", "manage.py", "runserver", "0.0.0.0:8000"]
