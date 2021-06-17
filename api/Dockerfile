FROM python:3.7.10-slim-buster

WORKDIR /

COPY requirements.txt ./

RUN pip3 install -r requirements.txt

COPY ./api-entrypoint.sh /api-entrypoint.sh
RUN chmod +x /api-entrypoint.sh

COPY . ./

ENTRYPOINT [ "/api-entrypoint.sh" ]
