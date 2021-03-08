# Overview
Django app runs on a certain port (in our case 8000)

Celery is a job based queue made up of two components in our project: The "Worker" and the "Beat". 
- The Worker sends tasks to be executed (e.g a function that retrieves CAN data and sends it to a websocket)
- The Beat receives the task, adds it to the queue, and executes the task 
- They can be run from the corresponding script names in the `Pipfile` (e.g `pipenv run worker`). Note that you need to run both at the same time or the task execution won't work.  
- The Celery config / settings can be found at `celery.py` under `django_app/` folder. 
- Tasks are defined in the `tasks.py` file of the Django app involved (e.g `can_server/`). 

## Websocket endpoints

Note: All of the following endpoints are prefixed with `ws://`

`ws/can_server/converted` is a websocket that sends converted CAN data 

`ws/can_server/raw` is a websocket that sends raw CAN data 






