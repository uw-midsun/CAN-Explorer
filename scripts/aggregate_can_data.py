# This script recieves CAN data,sends it to FRED with MQTT,
# and stores the data locally
# This should be run by the RPI for the telemetry system

# If you are running this script with virtual CAN
# ensure that it is set up first
# You can run the below commands
# sudo modprobe vcan
# sudo ip link add dev vcan0 type vcan
# sudo ip link set up vcan0

import cantools
import can
import csv
from datetime import datetime
from dotenv import load_dotenv
import json
import os
import paho.mqtt.client as mqtt

load_dotenv()

can_bus = can.interface.Bus('vcan0', bustype='socketcan')
db = cantools.database.load_file('system_can.dbc')

broker = "mqtt.sensetecnic.com"
port = 1883
client = mqtt.Client(client_id=os.getenv("MQTT_CLIENT_ID"))
client.username_pw_set(username=os.getenv("MQTT_USERNAME"),
                       password=os.getenv("MQTT_PASSWORD"))

# Write new line and header
with open('can_messages.csv', 'a', newline='') as csvfile:
    fieldnames = ['datetime', 'name', 'sender', 'data']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writerow({'datetime': '', 'name': '', 'sender': '', 'data': ''})
    writer.writeheader()


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Successfully connected")
    else:
        print("Bad connection returned code=", rc)


def connect():
    client.on_connect = on_connect
    client.connect(broker, port, 60)
    client.loop_start()


def decode_and_send():
    message = can_bus.recv()
    decoded = db.decode_message(message.arbitration_id, message.data)

    time = str(datetime.fromtimestamp(message.timestamp))
    name = db.get_message_by_frame_id(message.arbitration_id).name
    sender = db.get_message_by_frame_id(message.arbitration_id).senders[0]
    can_decoded_data = {'datetime': time, 'name': name,
                        'sender': sender, 'data': decoded}

    # Send data out to a CSV file and FRED
    write_to_csv(can_decoded_data)
    client.publish("accounts/midnight_sun/CAN",
                   payload=json.dumps(can_decoded_data), qos=2)


def write_to_csv(can_decoded_data):
    with open('can_messages.csv', 'a', newline='') as csvfile:
        fieldnames = ['datetime', 'name', 'sender', 'data']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writerow(can_decoded_data)


def main():
    connect()
    while(True):
        decode_and_send()


if __name__ == "__main__":
    main()
