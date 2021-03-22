# Django setup

For the first-time setup, at the root folder run
```
pipenv install 
```

You may also need to export a Django settings environment variable for commands like running the server to work
```
export DJANGO_SETTINGS_MODULE=django_app.settings
```

# Run Django App

You'll need 3 separate terminal shells open (4 if mocking data)

## 1st shell: Web server
For first run
```
pipenv run makemigrations
pipenv run migrate
```

To run server,
```
pipenv run start
```

Go to http://192.168.24.24:8000/ in your local browser to check website

## 2nd shell: Celery worker
Make sure Redis is started
```
sudo systemctl start redis.service
```

Confirm that Redis is running
```
sudo systemctl status redis.service
```

Then run 
```
pipenv run worker
```

## 3rd shell: Celery beat
Run 
```
pipenv run beat
```


## (Optional) 4th shell: Mock data

Make sure vcan is started 
```
sudo modprobe vcan && sudo ip link add dev vcan0 type vcan && sudo ip link set up vcan0
```

Make sure mock_can_data is setup for testing
```
pipenv run mock_data
```

