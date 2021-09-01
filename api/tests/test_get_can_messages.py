from rest_framework.test import APITestCase
import cantools
import can
import json

db = cantools.database.load_file('system_can.dbc')

class GetCanMessageTestCase(APITestCase):

    def test_get_message(self):
        # Validate that CAN message data matches original data from DBC file
        # DBC file must be added to database before CAN messages can be sent and received
        self.client.post('/upload/dbc', {
            'data': open('system_can.dbc', 'rb')
        }, format='multipart')

        response = self.client.get('/view/can/system_can.dbc')
        # Unpack can messages from API response
        can_messages = json.loads(response.content)['response']

        # Check that correct status code is returned
        self.assertEqual(response.status_code, 200)

        for frame_id in can_messages:
            msg = db.get_message_by_frame_id(int(frame_id))

            # Verify the CAN message names are not modified
            self.assertEqual(can_messages[frame_id]["name"], msg.name)

            for sig in msg.signals:
                # Verify that each signal from the DBC file is sent and the bit length remains unaltered
                self.assertTrue(sig.name in can_messages[frame_id]["signals"])
                self.assertEqual(sig.length, can_messages[frame_id]["signals"][sig.name])

    def test_get_message_fail_conditions(self):
        # Test failure when the DBC file does not exist in the database
        response = self.client.get('/view/can/system_can.dbc')
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(json.loads(response.content)['response'], "File does not exist")
