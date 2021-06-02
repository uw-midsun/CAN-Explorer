FROM python:3.7.10-slim-buster

#RUN apk add make automake gcc g++ subversion python3-dev

WORKDIR /api 

COPY Pipfile requirements.txt ./

#RUN pip3 install pipenv

RUN pip3 install -r requirements.txt

COPY . ./

#RUN pipenv makemigrations
#RUN python3 manage.py makemigrations can_server

#RUN pipenv migrate
#RUN python3 manage.py migrate

#CMD ["pipenv", "start"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]