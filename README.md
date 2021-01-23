# CAN-Explorer
An application to visualize CAN data and interact with the CAN bus

# Run Django App

Install libraries at root of folder
```
pip install -r requirements.txt
```

Make sure you're on venv
```
python3 -m venv ~/.virtualenvs/djangodev
source ~/.virtualenvs/djangodev/bin/activate
```

__If source command isn't available, run__
```
~/.virtualenvs/djangodev/bin/activate
```

To run server,
```
cd django_app
python3 manage.py runserver 0.0.0.0:8000
```

Go to http://192.168.24.24:8000/ in your local browser to check website




