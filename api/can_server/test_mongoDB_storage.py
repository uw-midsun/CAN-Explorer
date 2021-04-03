from django.test import TestCase
import can
import cantools
from datetime import datetime
from can_server.models import CanServerDecoded, CanServerRaw
from can_server.serializers import CanServerRawSerializer, CanServerDecodedSerializer
from django_app import tasks
import mock_can_data

can_bus = can.interface.Bus('vcan0', bustype='socketcan')
db = cantools.database.load_file('system_can.dbc')

class MessageStorageTestCase(TestCase):

    def test_single_message_storage(self):
        sleep_time_s = 0.1
        num_messages = 1
        mock_can_data.main(sleep_time_s, num_messages)

        message = can_bus.recv()
        decoded = db.decode_message(message.arbitration_id, message.data)
        print(decoded, "DECODED")
        time = str(datetime.fromtimestamp(message.timestamp))
        name = db.get_message_by_frame_id(message.arbitration_id).name
        sender = db.get_message_by_frame_id(message.arbitration_id).senders[0]

        tasks.stream_decoded_to_db(time, name, sender, decoded)

        can_raw_data = CanServerRaw.objects.all()
        can_decoded_data = CanServerDecoded.objects.all()
        raw_serializer = CanServerRawSerializer(
            can_raw_data, many=True)
        decoded_serializer = CanServerDecodedSerializer(
            can_decoded_data, many=True)

        db_decoded_list = list(decoded_serializer.data[0].items())
        db_decoded_datetime = db_decoded_list[0][1]
        db_decoded_name = db_decoded_list[1][1]
        db_decoded_sender = db_decoded_list[2][1]
        db_decoded_data = db_decoded_list[3][1]

        self.assertEqual(db_decoded_name, name)
        self.assertEqual(db_decoded_sender, sender)
        #self.assertEqual(db_decoded_data, decoded)