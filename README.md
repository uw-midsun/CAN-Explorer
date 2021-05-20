# CAN-Explorer
An application to visualize CAN data and interact with the CAN bus

SSH into the vagrant box and run
```
git clone https://github.com/uw-midsun/CAN-Explorer.git
cd CAN-Explorer
```

## Run the app
To start the frontend and the influxdb engine, run 
`docker-compose up -d` in the vagrant development box

then head over to `localhost:3000` in your local browser to view the CAN-Explorer frontend.

If you want to see the InfluxDB frontend, visit `localhost:8086`

### AS OF MAY 19
You will have to expose your ports on Vagrant if you want to access the influxdb frontend. Add the following line underneath the other forwarded ports in the Vagrantfile from the box repo.

```ruby
config.vm.network :forwarded_port, host: 8086, guest: 8086
```

To stop the containers, run `docker-compose stop`

## Sending mock data
Run `make mock_can_data`

To stop data transmission, run `make stop_can_data`

# InfluxDB login
Username: `firmware`

Password: `ilovecans`

