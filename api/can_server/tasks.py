# This script recieves CAN data and stores the data on mongodb

import cantools
import can
import csv
from datetime import datetime
import json
import os
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from celery import shared_task
# from ..django_app.celery import app
import asyncio

# from celery.task.schedules import crontab
# from celery.decorators import periodic_task
# from celery.utils.log import get_task_logger
# logger = get_task_logger(__name__)

channel_layer = get_channel_layer()

can_bus = can.interface.Bus('vcan0', bustype='socketcan')
db = cantools.database.load_file('system_can.dbc')

# every 2 seconds
#  @periodic_task(run_every=4, name="task_decode_send", ignore_result=True)
@shared_task
def task_decode_send():
    decode_and_send()
    # logger.info("Sent CAN data")

@shared_task
def decode_and_send():
    message = can_bus.recv()
    decoded = db.decode_message(message.arbitration_id, message.data)

    time = str(datetime.fromtimestamp(message.timestamp))
    name = db.get_message_by_frame_id(message.arbitration_id).name
    sender = db.get_message_by_frame_id(message.arbitration_id).senders[0]

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

    can_decoded_data = {'datetime': time, 'name': name,
                        'sender': sender, 'data': decoded}

    async_to_sync(channel_layer.group_send)("converted", {"type": "websocket_receive", 'datetime': time, 'name': name,
                                                           'sender': sender, 'data': decoded})

    async_to_sync(channel_layer.group_send)("raw", {"type": "websocket_receive", 'timestamp': message.timestamp, 'dlc': message.dlc, 'channel': message.channel, 'data': message.data.decode('utf-8', 'replace')})
