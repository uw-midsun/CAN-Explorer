# CAN-Explorer
An application to visualize CAN data and interact with the CAN bus

## Requirements:
Python >=3.6
MongoDB 3.6.3

## Django setup

The Django app requires Python >= 3.6 and MongoDB >= 3.6.3
Python should be installed in the Vagrant box already, but if you don't have MongoDB, run 
```
sudo apt install mongodb
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

Install libraries at root of folder
```
pip install -r requirements.txt
```

## Run Django App

__As of Jan 23__ 

Make sure you have pulled the most recent version of [uwmidsun/box](https://github.com/uw-midsun/box) if you haven't done so already and run `vagrant reload && vagrant ssh` to apply new port-forwarding settings

To run server,
```
cd django_app
python3 manage.py runserver 0.0.0.0:8000
```

Go to http://192.168.24.24:8000/ in your local browser to check website




