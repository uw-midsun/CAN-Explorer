# CAN-Explorer
An application to visualize CAN data and interact with the CAN bus

SSH into the vagrant box and run
```
git clone https://github.com/uw-midsun/CAN-Explorer.git
cd CAN-Explorer
```
## Requirements:
Python >=3.6
MongoDB >= 3.6.3


The Django app requires Python >= 3.6 and MongoDB >= 3.6.3
Python should be installed in the Vagrant box already, but if you don't have MongoDB...

## MongoDB setup
To setup mongoDB for data collection run (only necessary the first time you start working with the database)
```
bash mongo_setup.sh
```
Start the MongoDB server with
```
sudo systemctl start mongod
```
Verify that the server is active with
```
sudo systemctl status mongod
```
When you are ready to shutdown the database run
```
sudo systemctl stop mongod
```

## Django setup

For the first-time setup, make sure you're on venv
```
python3 -m venv ~/.virtualenvs/djangodev
```

For subsequent runs, 
```
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

For first run
```
cd django_app
python manage.py makemigrations
python manage.py migrate
```

To run server,
```
python3 manage.py runserver 0.0.0.0:8000
```

Go to http://192.168.24.24:8000/ in your local browser to check website

