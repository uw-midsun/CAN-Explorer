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
Python3 should be installed in the Vagrant box already.

## Dependencies setup (Mongo, Pipenv, Redis)
To setup all dependencies (only necessary the first time you start working with the project), run the following in your terminal
```
bash setup.sh
```

Verify that the MongoDB server is active with
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

Make sure Redis is started
```
sudo systemctl start redis.service
```

Confirm that Redis is running
```
sudo systemctl status redis.service
```

Exit the vagrant shell and reload the box,
```
vagrant reload && vagrant ssh
```

And you should be good to go! 