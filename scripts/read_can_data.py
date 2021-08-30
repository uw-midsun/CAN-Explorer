# This script recieves CAN data and stores the data on mongodb

from datetime import datetime
import json
import random
import argparse
import sys
import os
import cantools
import can
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

# InfluxDB config
token = "123456"
org = "midnightsun"
raw_bucket = "raw_data"
converted_bucket = "converted_data"

# Helper utilities to silence / enable output

# Disable
def blockPrint():
    sys.stdout = open(os.devnull, 'w')

# Restore
def enablePrint():
    sys.stdout = sys.__stdout__

parser = argparse.ArgumentParser()
parser.add_argument('-s', action='store_true', help="silence output")
options = parser.parse_args()

client = InfluxDBClient(url="http://localhost:8086", token=token)
write_api = client.write_api(write_options=SYNCHRONOUS)

can_bus = can.interface.Bus('vcan0', bustype='socketcan')
db = cantools.database.load_file('system_can.dbc')


def decode_and_send():
    message = can_bus.recv()
    decoded = db.decode_message(message.arbitration_id, message.data)
    print(decoded) # dict datatype

    time = str(datetime.fromtimestamp(message.timestamp))
    name = db.get_message_by_frame_id(message.arbitration_id).name
    sender = db.get_message_by_frame_id(message.arbitration_id).senders[0]

    # if -s flag is set, silence output
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
    print(message.dlc)
    print(message.data)

    rawpoint = Point(sender).field("dec", dec).tag("arbitration_id", message.arbitration_id).tag("dlc", message.dlc).tag("channel", message.channel).tag("hex", hex).tag("bin", bin)

    conpoints = []
    for key, value in decoded.items():
        conpoints.append(Point(sender).field(key, value).tag("name", name))
    
    write_api.write(raw_bucket, org, [rawpoint])
    write_api.write(converted_bucket, org, conpoints)


def main():
    while True:
        try:
            decode_and_send()
        except KeyboardInterrupt:
            break
    print("\nCollection halted")


if __name__ == "__main__":
    main()
