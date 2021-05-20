# This script recieves CAN data and stores the data on mongodb

import cantools
import can
from datetime import datetime
# from asgiref.sync import async_to_sync
# from channels.layers import get_channel_layer
# from celery import shared_task
# import requests
import json
import random
import argparse
import sys
import os

# Disable
def blockPrint():
    sys.stdout = open(os.devnull, 'w')

# Restore
def enablePrint():
    sys.stdout = sys.__stdout__

parser = argparse.ArgumentParser()
parser.add_argument('-s', action='store_true')
options = parser.parse_args()

from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

# You can generate a Token from the "Tokens Tab" in the UI
token = "123456"
org = "midnightsun"
bucket = "can_explorer"

client = InfluxDBClient(url="http://localhost:8086", token=token)
write_api = client.write_api(write_options=SYNCHRONOUS)

# channel_layer = get_channel_layer()


can_bus = can.interface.Bus('vcan0', bustype='socketcan')
db = cantools.database.load_file('system_can.dbc')


def decode_and_send():
    message = can_bus.recv()
    decoded = db.decode_message(message.arbitration_id, message.data)

    time = str(datetime.fromtimestamp(message.timestamp))
    name = db.get_message_by_frame_id(message.arbitration_id).name
    sender = db.get_message_by_frame_id(message.arbitration_id).senders[0]

    if options.s:
        blockPrint()

    # hexadecimal representation of data
    hex = ''.join('{:02x}'.format(x) for x in message.data)
    print(hex)

    # binary rep. of data
    # most significant bit
    bin = ''.join(format(byte, '08b') for byte in message.data)
    print(bin)

    # decimal rep. of data
    dec = int.from_bytes(message.data, byteorder='big', signed=False)
    print(dec)

    print(message.arbitration_id)

    payload = {
        "time": datetime.utcnow(),
        "ArbitrationID": message.arbitration_id,
        "DLC": 7,
        "Channel": "vcan",
        "Data": random.randint(6, 9)
    }
    # r = requests.post("http://192.168.24.24:8000/api/can_server/raw", data=json.dumps(payload))
    # print(r.content)
    # print(r.text)
    # print(r.json)

    # point = Point("mem").tag("host", "host1").field("used_percent", 23.43234543).time(datetime.utcnow(), WritePrecision.NS)
    
    # TODO convert can_bus timestamp to UTC 


    arbpoint = Point("mem").field("test2", 1).tag("arbitration_id", message.arbitration_id).tag("dlc", 7).tag("data", random.randint(6, 9))
    # dlcpoint = Point("mem").field("test2", 2).tag("dlc", 7)
    # datapoint = Point("mem").field("test2", 3).tag("data", random.randint(6, 9))

    # write_api.write(bucket, org, [arbpoint, dlcpoint, datapoint])
    write_api.write(bucket, org, [arbpoint])


    # json_body = [
    #     {
    #         "time": datetime.utcnow(),
    #         "ArbitrationID": message.arbitration_id,
    #         "DLC": 7,
    #         "Channel": "vcan",
    #         "Data": random.randint(6, 9)
    #     }
    # ]

# async_to_sync(channel_layer.group_send)("raw", {"type": "websocket_receive", 'timestamp': message.timestamp,
#                                                 'dlc': message.dlc, 'channel': message.channel, 'data': message.data.decode('utf-8', 'replace')})


def main():
    while True:
        try:
            decode_and_send()
        except KeyboardInterrupt:
            break
    print("\nCollection halted")


if __name__ == "__main__":
    main()
