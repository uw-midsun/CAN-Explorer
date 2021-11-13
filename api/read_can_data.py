# This script recieves CAN data and stores the data on mongodb

from datetime import datetime
import json
import random
import argparse
import sys
import os
import time
import cantools
import can
import requests
import asyncio
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

# InfluxDB config
token = "123456"
org = "midnightsun"
raw_bucket = "raw_data"
converted_bucket = "converted_data"

# Disables printing
def blockPrint():
    sys.stdout = open(os.devnull, 'w')

# Restores printing
def enablePrint():
    sys.stdout = sys.__stdout__

parser = argparse.ArgumentParser()
parser.add_argument('-s', action='store_true', help="silence output")
options = parser.parse_args()

client = InfluxDBClient(url="http://localhost:8086", token=token)
write_api = client.write_api(write_options=SYNCHRONOUS)

can_channel="vcan0"
can_bustype="socketcan"
can_bitrate=800000
can_dbc_file="system_can.dbc"

can_bus = can.interface.Bus(can_channel, bustype=can_bustype, bitrate=can_bitrate)
db = cantools.database.load_file(can_dbc_file)

# python concurrency leaves much to be desired, so we have to use some 'tricks'
# https://stackoverflow.com/questions/8600161/executing-periodic-actions/20169930#20169930
async def do_every(period, f, *args):
    def g_tick():
        t = time.time()
        while True:
            t += period
            yield max(t - time.time(),0)
    g = g_tick()
    while True:
        time.sleep(next(g))
        f(*args)

async def update_can_settings():
    while True:
        try:
            response = requests.get("http://localhost:8000/get_can_settings")
            r = response.json()
            can_channel = r['channel']
            can_bustype = r['bustype']
            can_bitrate = r['bitrate']
            can_bus = can.interface.Bus(can_channel, bustype=can_bustype, bitrate=can_bitrate)
            await asyncio.sleep(0.01)
        except Exception as e:
            await asyncio.sleep(0.01)

async def decode_and_send():
    while True:
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

        conpoints = []
        for key, value in decoded.items():
            conpoints.append(Point(sender).field(key, value).tag("name", name).field("dec", dec).tag("arbitration_id", message.arbitration_id).tag("dlc", message.dlc).tag("hex", hex).tag("bin", bin).tag("channel", message.channel).tag("bustype", can_bustype).tag("bitrate", can_bitrate))
        
        write_api.write(converted_bucket, org, conpoints)
        await asyncio.sleep(0.01)

# run read script forever
loop = asyncio.get_event_loop()
asyncio.ensure_future(decode_and_send())
asyncio.ensure_future(update_can_settings())
loop.run_forever()
