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
bash setup.sh
```
Verify that the server is active with
```
sudo systemctl status mongod
```
If you would like to disable mongod from starting when you ssh into the box, run
```
sudo systemctl disable mongod
```
If you disable mongod you will have to manually start and stop mongod with
```
sudo systemctl start mongod
```
and
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
cd api
```

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

## Mongo Display Setup
If node 14.x isn't already installed on your system run
```
bash setup.sh
```
*Node may have been installed if you followed the MongoDB setup steps

For windows users run git bash as administrator before continuing.

Navigate to the client folder and install all dependencies with
```
cd client
npm install
```

To start the frontend run,
```
npm start
```

For first-time setup you may encounter the following error 
```
ENOSPC: System limit for number of file watchers reached
```
Run,
```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
to increase the number of file watchers and then run
```
npm start
```

Follow the steps in "Run Django App" to start the server

*Note your MongoDB instance must be running for the app to work

The decoded data will appear at http://localhost:3000/api/can_server/decoded
and raw data will appear at http://localhost:3000/api/can_server/raw
