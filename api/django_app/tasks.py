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

can_bus = can.interface.Bus('vcan0', bustype='socketcan')
db = cantools.database.load_file('system_can.dbc')


def stream_decoded_to_db(time, name, sender, decoded):
    can_decoded_msg = {
        'Datetime': time,
        'Name': name,
        'Sender': sender,
        'Data': decoded}
    decoded_serializer = CanServerDecodedSerializer(data=can_decoded_msg, many=True)
    if decoded_serializer.is_valid():
        print(decoded_serializer.data, "WHY!!!")
        decoded_serializer.save()
        print("Decoded message sent", can_decoded_msg)
    else:
        print("Invalid decoded message", can_decoded_msg)

def stream_raw_to_db(timestamp, arbitration_id, dlc, raw):
    can_raw_msg = {
        'Timestamp': timestamp,
        'ArbitrationID': arbitration_id,
        'DLC': dlc,
        'Data': raw}
    raw_serializer = CanServerRawSerializer(data=can_raw_msg)
    if raw_serializer.is_valid():
        raw_serializer.save()
        print("Raw message sent", can_raw_msg)
    else:
        print("Invalid raw message", can_raw_msg)

def receive_messages():
    message = can_bus.recv()
    decoded = db.decode_message(message.arbitration_id, message.data)

    time = str(datetime.fromtimestamp(message.timestamp))
    name = db.get_message_by_frame_id(message.arbitration_id).name
    sender = db.get_message_by_frame_id(message.arbitration_id).senders[0]

    stream_decoded_to_db(time, name, sender, decoded)
    stream_raw_to_db(message.timestamp, message.arbitration_id, message.dlc, message.data)

@shared_task()
def decode_and_send():
    receive_messages()
