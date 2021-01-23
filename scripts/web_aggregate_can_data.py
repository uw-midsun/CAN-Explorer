import asyncio
import cantools
import can
import websockets


can_bus = can.interface.Bus('vcan0', bustype='socketcan')
db = cantools.database.load_file('system_can.dbc')


async def decode_and_send(websocket, path):
    while True:
        message = can_bus.recv()
        decoded = db.decode_message(message.arbitration_id, message.data)
        name = db.get_message_by_frame_id(message.arbitration_id).name
        sender = db.get_message_by_frame_id(message.arbitration_id).senders[0]
        can_decoded_data = name + '-' + sender + '-' + str(decoded)
        print(can_decoded_data)
        await websocket.send(str(can_decoded_data))


def main():
    start_server = websockets.serve(decode_and_send, "localhost", 8765)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()


if __name__ == "__main__":
    main()
