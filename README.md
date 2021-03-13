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

# Pipenv
To have a global install of pipenv, run
```
sudo -H pip3 install -U pipenv
```

# Redis setup
Get the latest version of Redis with
```
sudo add-apt-repository ppa:chris-lea/redis-server
sudo apt-get update
sudo apt -y install redis-server
```

Edit configuration file for systemctl to be able to run it. You can substitute nano with vim if you want
```bash
sudo nano /etc/redis/redis.conf
```

and replace the following fields
```
# If you run Redis from upstart or systemd, Redis can interact with your
# supervision tree. Options:
#   supervised no      - no supervision interaction
#   supervised upstart - signal upstart by putting Redis into SIGSTOP mode
#   supervised systemd - signal systemd by writing READY=1 to $NOTIFY_SOCKET
#   supervised auto    - detect upstart or systemd method based on
#                        UPSTART_JOB or NOTIFY_SOCKET environment variables
# Note: these supervision methods only signal "process is ready."
#       They do not enable continuous liveness pings back to your supervisor.
supervised systemd
. . .
```

Next you'll have to edit the systemd redis service file so the PID can correctly run in the box
```bash
sudo nano /etc/systemd/system/redis.service
```

Replace start of the service section with this
```
[Service]
Type=forking
ExecStart=/usr/bin/redis-server /etc/redis/redis.conf
ExecStop=/bin/kill -s TERM $MAINPID
ExecStartPost=/bin/sh -c "echo $MAINPID > /var/run/redis/redis.pid"
PIDFile=/run/redis/redis-server.pid
```

Now restart the service
```
sudo systemctl daemon-reload
sudo systemctl restart redis.service
```

Exit the vagrant shell and reload the box,
```
vagrant reload && vagrant ssh
```

And you should be good to go! 

You can configure Redis to start on boot of VM 
```
sudo systemctl enable --now redis-server
```

Or if you want to start Redis manually,
```
sudo systemctl start redis.service
```

