# CAN-Explorer
An application to visualize CAN data and interact with the CAN bus

SSH into the vagrant box and run
```
git clone https://github.com/uw-midsun/CAN-Explorer.git
cd CAN-Explorer
```
## Requirements:
The Django app requires Python >= 3.6 and MongoDB >= 3.6.3
Python3 should be installed in the Vagrant box already, but if you don't have MongoDB...

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

For the first-time setup, at the root folder run
```
pipenv install 
```

## Run Django App

__As of Jan 23__ 

Make sure you have pulled the most recent version of [uwmidsun/box](https://github.com/uw-midsun/box) if you haven't done so already and run `vagrant reload && vagrant ssh` to apply new port-forwarding settings

Navigate to backend folder
```
cd backend
```

Installing Redis (>= 6.0)
https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04
https://computingforgeeks.com/how-to-install-redis-on-ubuntu-18-04-debian-9/

Make sure Redis is started
```
TODO
```

Make sure vcan is started 
```
sudo modprobe vcan && sudo ip link add dev vcan0 type vcan && sudo ip link set up vcan0
```

Make sure mock_can_data is setup for testing

For first run
```
python manage.py makemigrations
python manage.py migrate
```

To run server,
```
pipenv run start
```

Go to http://192.168.24.24:8000/ in your local browser to check website

