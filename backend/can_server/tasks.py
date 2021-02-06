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
@periodic_task(run_every=2, name="task_decode_send", ignore_result=True)
def task_decode_send():
    decode_and_send()
    print(2)
    logger.info("Sent CAN data")


def decode_and_send():
    # await asyncio.sleep(1)
    # print("hello")
    message = can_bus.recv()
    decoded = db.decode_message(message.arbitration_id, message.data)
    print(f"message is {decoded}")
    # print("bruh")

    time = str(datetime.fromtimestamp(message.timestamp))
    name = db.get_message_by_frame_id(message.arbitration_id).name
    sender = db.get_message_by_frame_id(message.arbitration_id).senders[0]
    # print("bruh")
    can_decoded_data = {'datetime': time, 'name': name,
                        'sender': sender, 'data': decoded}
    print(can_decoded_data)
    async_to_sync(channel_layer.group_send)("converted", {"type": "websocket_receive", 'datetime': time, 'name': name,
                                                           'sender': sender, 'data': decoded})
    async_to_sync(channel_layer.group_send)("raw", {"type": "websocket_receive", 'msg': "suppp"})

    # logger.info("Sent CAN data")

    # return can_decoded_data


# def main():
#     while(True):
#         decode_and_send()


# if __name__ == "__main__":
#     main()
