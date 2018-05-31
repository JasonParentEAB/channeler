FROM python:3.6.5

ENV PYTHONUNBUFFERED 1
ENV REDIS_HOST redis

ADD ./requirements.txt requirements.txt
RUN pip install -r requirements.txt

WORKDIR /code/channeler
