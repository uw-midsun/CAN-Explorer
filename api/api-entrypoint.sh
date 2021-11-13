#!/bin/bash

# apt -qq update && apt install -qq -y can-utils iproute2
# ip link add dev vcan0 type vcan
# ip link set up vcan0

# only run one background process of reading CAN data
if [ -z $(ps aux | grep "python3 read_can_data.py" | grep -v "grep") ]; then 
    python read_can_data.py &
fi 

python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
