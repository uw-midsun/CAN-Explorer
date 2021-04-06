# This script recieves CAN data and stores the data on mongodb

import cantools
import can
from datetime import datetime
# from asgiref.sync import async_to_sync
# from channels.layers import get_channel_layer
# from celery import shared_task

# channel_layer = get_channel_layer()

can_bus = can.interface.Bus('vcan0', bustype='socketcan')
db = cantools.database.load_file('system_can.dbc')

# def task_decode_send():
#     decode_and_send()

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

    # async_to_sync(channel_layer.group_send)
    # ("converted",
    #  {"type": "websocket_receive",
    #   'datetime': time,
    #   'name': name,
    #   'sender': sender,
    #   'data': decoded})

    # async_to_sync(channel_layer.group_send)
    # ("raw",
    #  {"type": "websocket_receive",
    #   'timestamp': message.timestamp,
    #   'dlc': message.dlc,
    #   'channel': message.channel,
    #   'data': message.data.decode('utf-8',
    #                               'replace')})

def main():
    while True:
        try:
            decode_and_send()
        except KeyboardInterrupt:
            break
    print("Collection halted")

if __name__ == "__main__":
    main()