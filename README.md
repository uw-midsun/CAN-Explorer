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

## Dependencies setup (MongoDB, Pipenv, Node)
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

# Starting the Server
Enter the virtual environment with
```
pipenv shell
```
If you have not installed dependencies run
```
pipenv install
```
cd into the api folder 
```
cd api
```
and start the server with
```
pipenv run start
```
*Note that the Mongo Daemon must be active

# Starting the Client
cd into the client folder
```
cd client
```
Install dependencies with
```
npm install
```
and run
```
npm start
```
to start the React app

# Testing
Enter the virtual environment with
```
pipenv shell
```
If you have not installed dependencies run
```
pipenv install
```
cd into the api folder 
```
cd api
```
and run tests with
```
pipenv run test
```
