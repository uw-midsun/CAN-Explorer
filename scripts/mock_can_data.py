""" Module for mocking CAN data """

# If you are running this script with virtual CAN
# ensure that it is set up first
# You can run the below commands
# sudo modprobe vcan
# sudo ip link add dev vcan0 type vcan
# sudo ip link set up vcan0
# To silence message output, add -s flag when running script

import time
import random
import argparse
import cantools
import can
import requests
import json

parser = argparse.ArgumentParser()
parser.add_argument('-s', action='store_true', help="silence output")
parser.add_argument('-m', help="only send specific CAN messages")
options = parser.parse_args()

# A negative value for num_messages will cause the script to send CAN
# messages forever
NUM_MESSAGES = -1
SLEEP_TIME_S = 3
can_messages = []

# This can be edited depending on the CAN interface
can_bus = can.interface.Bus('vcan0', bustype='socketcan')

# pylint: disable=broad-except
try:
    db = cantools.database.load_file('system_can.dbc')
except BaseException:
    print("Must generate DBC file first")
    print("Run make gen && make gen-dbc")


def main():
    """ Main function """
    get_messages()
    iterate_message_and_signal()


def get_messages():
    """ Gets messages """
    for msg in db.messages:
        can_messages.append(msg)


def iterate_message_and_signal():
    """ Iterates through messages from dbc file and sends them to CAN bus """
    num_messages_sent = 0
    while NUM_MESSAGES < 0 or NUM_MESSAGES > num_messages_sent:
        try:
            res = requests.get("http://localhost:8000/get_can_settings")
            data = res.json()
            can_bus = can.interface.Bus('vcan0', bustype='socketcan', bitrate=data['bitrate'])
            
            res = requests.get("http://localhost:8000/view/dbc")
            data = res.json()
            
            send_message()
            num_messages_sent += 1
            time.sleep(SLEEP_TIME_S)
        except KeyboardInterrupt:
            break
    print("\n" + str(num_messages_sent) + " CAN messages have been sent")


def send_message():
    """ Sends message to CAN bus """
    if options.m:
        msg = [x for x in can_messages if x.name == options.m][0]
    else:
        msg = random.choice(can_messages)
    data = {}
    for signal in msg.signals:
        data[signal.name] = random.randint(0, pow(2, signal.length) - 1)
    new_data = msg.encode(data)
    message = can.Message(arbitration_id=msg.frame_id, data=new_data)
    if not options.s:
        print(message)
    can_bus.send(message)

if __name__ == "__main__":
    main()
