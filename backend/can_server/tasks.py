# This script recieves CAN data and stores the data on mongodb

import cantools
import can
import csv
from datetime import datetime
import json
import os
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import asyncio
from celery.task.schedules import crontab
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger
logger = get_task_logger(__name__)

channel_layer = get_channel_layer()

can_bus = can.interface.Bus('vcan0', bustype='socketcan')
db = cantools.database.load_file('system_can.dbc')

# every 2 seconds
@periodic_task(run_every=4, name="task_decode_send", ignore_result=True)
def task_decode_send():
    decode_and_send()
    logger.info("Sent CAN data")


def decode_and_send():
    # await asyncio.sleep(1)
    # print("hello")
    message = can_bus.recv()
    decoded = db.decode_message(message.arbitration_id, message.data)
    # print(f"message is {decoded}")

    time = str(datetime.fromtimestamp(message.timestamp))
    name = db.get_message_by_frame_id(message.arbitration_id).name
    sender = db.get_message_by_frame_id(message.arbitration_id).senders[0]

    print("message")
    print(message)
    print("decoded")
    print(decoded)
    print("time")
    print(time)
    print("name")
    print(name)
    print("sender")
    print(sender)
    print("data")
    print(message.timestamp)
    print(message.dlc)
    print(message.channel)
    print(message.data)
    print('new')
    new_data = "".join(map(chr, message.data))
    print(new_data)
    # print("'{}'".format(message.data.decode('utf-8', 'replace')))
    # hex
    print(''.join('{:02x}'.format(x) for x in message.data))
    # bin
    # most significant bit
    print(''.join(format(byte, '08b') for byte in message.data))

    # dec
    print(int.from_bytes(message.data, byteorder='big', signed=False))

    can_decoded_data = {'datetime': time, 'name': name,
                        'sender': sender, 'data': decoded}
    # print(can_decoded_data)

    async_to_sync(channel_layer.group_send)("converted", {"type": "websocket_receive", 'datetime': time, 'name': name,
                                                           'sender': sender, 'data': decoded})

    async_to_sync(channel_layer.group_send)("raw", {"type": "websocket_receive", 'timestamp': message.timestamp, 'dlc': message.dlc, 'channel': message.channel, 'data': message.data.decode('utf-8', 'replace')})
