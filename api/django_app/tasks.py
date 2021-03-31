# This script recieves CAN data and stores the data on mongodb
import django
import cantools
import can
import csv
from datetime import datetime
import json
import os
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from celery import shared_task
import asyncio

django.setup()

# Must occur below django.setup()
from can_server.serializers import CanServerRawSerializer, CanServerDecodedSerializer
from can_server.models import CanServerRaw, CanServerDecoded

channel_layer = get_channel_layer()

can_bus = can.interface.Bus('vcan0', bustype='socketcan')
db = cantools.database.load_file('system_can.dbc')


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

    async_to_sync(channel_layer.group_send)("converted",
                                            {"type": "websocket_receive",
                                             'datetime': time,
                                             'name': name,
                                             'sender': sender,
                                             'data': decoded})

    async_to_sync(channel_layer.group_send)("raw",
                                            {"type": "websocket_receive",
                                             'timestamp': message.timestamp,
                                             'dlc': message.dlc,
                                             'channel': message.channel,
                                             'data': message.data.decode('utf-8',
                                                                         'replace')})

    can_decoded_msg = {
        'Datetime': time,
        'Name': name,
        'Sender': sender,
        'Data': decoded}
    can_raw_msg = {
        'Timestamp': message.timestamp,
        'ArbitrationID': message.arbitration_id,
        'DLC': message.dlc,
        'Data': message.data}

    decoded_serializer = CanServerDecodedSerializer(data=can_decoded_msg)
    raw_serializer = CanServerRawSerializer(data=can_raw_msg)

    if decoded_serializer.is_valid():
        decoded_serializer.save()
        print("Decoded message sent", can_decoded_msg)
    else:
        print("Invalid decoded message", can_decoded_msg)
    if raw_serializer.is_valid():
        raw_serializer.save()
        print("Raw message sent", can_raw_msg)
    else:
        print("Invalid raw message", can_raw_msg)
