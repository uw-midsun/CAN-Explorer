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
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

> Note: To verify that the installation was successful you can run
> ```bash
> docker run hello-world
> ```

To set up Docker Compose run
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

> To verify that the installation was successful you can run
> ```bash
> docker-compose --version
> ```

If any issues prop up, please consult the official [Docker installation article for Ubuntu Linux](https://docs.docker.com/engine/install/ubuntu/) and [post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/)

# Usage
To test without a CAN bus run `sudo make socketcan`.

To start the frontend and the influxdb engine, run `docker-compose up` then head over to `localhost:3000` in your local browser to view the CAN-Explorer frontend.

To stop the containers, run `docker-compose stop`

## InfluxDB login
Username: `firmware`

Password: `ilovecans`

To visualize the data coming in, refer to the "Explore" section in the InfluxDB UI

For some handy common templates, look through the `Board`s we have under the CAN-Explorer dashboard. 

# Flux cheatsheet
The default graphs should have most of the common views you'll be using often. However if you want to add some extra constraints, you will need to specify so using InfluxDB's special SQL-like language "Flux". Here's a quick cheatsheet for commands you'll likely need. 

## Specify values between a range 
```flux
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> filter(fn: (r) => r._value > 50.0 and r._value < 65.0 )
```

## Look for a certain CAN Message
```flux
from(bucket: "converted_data")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_field"] == "vehicle_velocity_left") // replace with appropriate CAN Message
  |> group()
```

## Only keep certain columns 
```
from(bucket: "raw_data")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> keep(columns: ["bin", "hex"])
  |> group()
```

Consult the [official Flux Documentation](https://docs.influxdata.com/influxdb/cloud/query-data/flux/) for more examples.
