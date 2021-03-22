# CAN-Explorer
An application to visualize CAN data and interact with the CAN bus

__As of Jan 23__ 

Make sure you have pulled the most recent version of [uwmidsun/box](https://github.com/uw-midsun/box) if you haven't done so already and run `vagrant reload && vagrant ssh` to apply new port-forwarding settings

SSH into the vagrant box and run
```
cd shared
git clone https://github.com/uw-midsun/CAN-Explorer.git
cd CAN-Explorer
```
## Requirements:
The Django app requires Python >= 3.6, Pipenv, MongoDB >= 3.6.3 and Redis >= 6.0
Python3 should be installed in the Vagrant box already, but if you don't have MongoDB...

## Dependencies setup (Mongo, Pipenv, Redis)
To setup all dependencies for data collection run (only necessary the first time you start working with the database)
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

Exit the vagrant shell and reload the box,
```
vagrant reload && vagrant ssh
```

And you should be good to go! 

export DJANGO_SETTINGS_MODULE=django_app.settings