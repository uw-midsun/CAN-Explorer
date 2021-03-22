""" Module for mocking CAN data """

# If you are running this script with virtual CAN
# ensure that it is set up first
# You can run the below commands
# sudo modprobe vcan
# sudo ip link add dev vcan0 type vcan
# sudo ip link set up vcan0

import time
import random
import cantools
import can

# A negative value for num_messages will cause the script to send CAN
# messages forever
NUM_MESSAGES = -1
SLEEP_TIME_S = 1
can_messages = []

# pylint: disable=broad-except
try:
    db = cantools.database.load_file('system_can.dbc')
except BaseException:
    print("Must generate DBC file first")
    print("Run make gen && make gen-dbc")

# This can be edited depending on the CAN interface
can_bus = can.interface.Bus('vcan0', bustype='socketcan')


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
            send_message()
            num_messages_sent += 1
            time.sleep(SLEEP_TIME_S)
        except KeyboardInterrupt:
            break
    print("\n" + str(num_messages_sent) + " CAN messages have been sent")


def send_message():
    """ Sends message to CAN bus """
    msg = random.choice(can_messages)
    data = {}
    for signal in msg.signals:
        data[signal.name] = random.randint(0, pow(2, signal.length) - 1)
    new_data = msg.encode(data)
    message = can.Message(arbitration_id=msg.frame_id, data=new_data)
    print(message)
    can_bus.send(message)


if __name__ == "__main__":
    main()
