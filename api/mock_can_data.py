# If you are running this script with virtual CAN
# ensure that it is set up first
# You can run the below commands
# sudo modprobe vcan
# sudo ip link add dev vcan0 type vcan
# sudo ip link set up vcan0

import cantools
import can
import time
import random

try:
    db = cantools.database.load_file('system_can.dbc')
except BaseException:
    print("Must generate DBC file first")
    print("Run make gen && make gen-dbc")

# This can be edited depending on the CAN interface
can_bus = can.interface.Bus('vcan0', bustype='socketcan')


# A negative value for num_messages will cause the script to send CAN
# messages forever
def main(sleep_time_s, num_messages):
    can_messages = []
    get_messages(can_messages)
    iterate_message_and_signal(can_messages, sleep_time_s, num_messages)


def get_messages(can_messages):
    for msg in db.messages:
        can_messages.append(msg)


def iterate_message_and_signal(can_messages, sleep_time_s, num_messages):
    num_messages_sent = 0
    while num_messages < 0 or num_messages > num_messages_sent:
        try:
            send_message(can_messages)
            num_messages_sent += 1
            time.sleep(sleep_time_s)
        except KeyboardInterrupt:
            break
    print("\n" + str(num_messages_sent) + " CAN messages have been sent")


def send_message(can_messages):
    msg = random.choice(can_messages)
    data = {}
    for signal in msg.signals:
        data[signal.name] = random.randint(0, pow(2, signal.length) - 1)
    new_data = msg.encode(data)
    message = can.Message(arbitration_id=msg.frame_id, data=new_data)
    print(message)
    can_bus.send(message)


if __name__ == "__main__":
    sleep_time_s = 1
    num_messages = -1
    main(sleep_time_s, num_messages)
