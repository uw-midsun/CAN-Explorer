# CAN-Explorer
An application to visualize CAN data and interact with the CAN bus

SSH into the vagrant box and run
```
git clone https://github.com/uw-midsun/CAN-Explorer.git
cd CAN-Explorer
```

## Docker install 
If you haven't installed Docker on the development box already, run the following
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh
``` 

If any issues prop up, please consult the official [Docker installation article for Ubuntu Linux](https://docs.docker.com/engine/install/ubuntu/) and [post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/)

# Run the app
To start the frontend and the influxdb engine, run 
`docker-compose up -d` in the vagrant development box

then head over to `localhost:3000` in your local browser to view the CAN-Explorer frontend.

If you want to see the InfluxDB frontend, visit `localhost:8086` and navigate to `Boards -> CAN-Explorer` from the side menu

WINDOWS USERS: Note that you will have to use Git Bash with __admin access__ or the Windows command prompt to start Vagrant and our Docker app. 

### AS OF MAY 19
You will have to expose your ports on Vagrant if you want to access the influxdb frontend. Add the following line underneath the other forwarded ports in the Vagrantfile from the box repo.

```ruby
config.vm.network :forwarded_port, host: 8086, guest: 8086
```

To stop the containers, run `docker-compose stop`

## InfluxDB login
Username: `firmware`

Password: `ilovecans`

## Sending mock data
Install python dependencies with `make install_requirements`

Run `make mock_and_read` (with -s flag if you want to silence output)

To stop data transmission, run `make stop_can_data`

You will need to generate a `system_can.dbc` file from the firmware repo and place it inside the `scripts` folder if you haven't done so already. 

## Troubleshooting

### Influx container showing "Get Started" / "Setup user" view
This means that the Influx docker container wasn't set up properly. Chances are that the container didn't get enough time to start the database before applying the setup configurations (which will vary based on how powerful your computer is). If this is the case, edit the `influxdb/docker-entrypoint.sh` file to add more seconds e.g 

```bash
...

sleep 30

...
```

# Flux cheatsheet
The default graphs should have most of the common views you'll be using often. However if you want to add some extra constraints, you will need to specify so using InfluxDB's special SQL-like language "Flux". Here's a quick cheatsheet for contraints you'll likely come across.

## Specify values between a range 
```
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> filter(fn: (r) => r._value > 50.0 and r._value < 65.0 )
```

