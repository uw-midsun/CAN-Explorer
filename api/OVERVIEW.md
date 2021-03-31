# Overview
Django app runs on a certain port (in our case 8000)

Celery worker sends tasks to be executed (e.g a function that retrieves CAN data and sends it to a websocket)
- Tasks are defined in the "tasks.py" file of the Django app involved
- 

Celery beat executes the task


## Websocket endpoints

Note: All of the following endpoints are prefixed with `ws://`

`ws/can_server/converted` is a websocket that sends converted CAN data 

`ws/can_server/raw` is a websocket that sends raw CAN data 
