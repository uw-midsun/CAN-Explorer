FROM python:3.7.10-slim-buster

COPY . ./api

WORKDIR /api

#COPY requirements.txt ./

RUN pip3 install -r requirements.txt

COPY ./api-entrypoint.sh /api-entrypoint.sh
RUN chmod +x /api-entrypoint.sh

ENTRYPOINT [ "/api-entrypoint.sh" ]
