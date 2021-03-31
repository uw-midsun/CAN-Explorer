## Mongo Display Setup
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

* Note your MongoDB instance must be running for the app to work

Follow the steps in "Run Django App" to start the server

*Note your MongoDB instance must be running for the app to work

The decoded data will appear at http://localhost:3000/api/can_server/decoded
and raw data will appear at http://localhost:3000/api/can_server/raw

For first-time setup you may encounter the following errors

### File system watchers
```
ENOSPC: System limit for number of file watchers reached
```
Run,
```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
to increase the number of file watchers

### Not enough memory / no directory
This occurs because NPM isn't too fond of shared folders on Virtualbox. To workaround this, you'll need to create a symlink to a node_modules _outside_ the shared folder. Inside the `client/` folder, run 
```
mkdir /home/vagrant/node_modules
ln -s /home/vagrant/node_modules/ node_modules
```
