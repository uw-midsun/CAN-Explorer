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

To stop the containers, run `docker-compose stop`

## Sending mock data
Run `make mock_can_data`

To stop data transmission, run `make stop_can_data`

You will need to generate a `system_can.dbc` file from the firmware repo and place it inside the `scripts` folder if you haven't done so already. 

# InfluxDB login
Username: `firmware`

Password: `ilovecans`

# Flux cheatsheet
The default graphs should have most of the common views you'll be using often. However if you want to add some extra constraints, you will need to specify so using InfluxDB's special SQL-like language "Flux". Here's a quick cheatsheet for contraints you'll likely come across.

## Specify values between a range 
```
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> filter(fn: (r) => r._value > 50.0 and r._value < 65.0 )
```

