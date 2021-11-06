from rest_framework.test import APITestCase
import cantools
import can
import json

can_bus = can.interface.Bus('vcan0', bustype='socketcan')
db = cantools.database.load_file('system_can.dbc')

class SendCanMessageTestCase(APITestCase):

    def test_send_message(self):
        # DBC file must be added to database before CAN messages can be sent and received
        self.client.post('/upload/dbc', {
            'data': open('system_can.dbc', 'rb')
        }, format='multipart')

        data = {
            "frame_id": 34,
            "name": "SET_RELAY_STATES",
            "file": "system_can.dbc",
            "signals": {
                "relay_mask": 25,
                "relay_state": 256
            }
        }

        # POST request with valid parameters are sent to the API
        response = self.client.post('/transmit', json.dumps(data), content_type='application/json')

        message = can_bus.recv()
        decoded = db.decode_message(message.arbitration_id, message.data)
        msg_name = db.get_message_by_frame_id(message.arbitration_id).name

        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content)['response'], "Message sent successfully")

        # Check whether frame_id, name, and signals match
        self.assertEqual(message.arbitration_id, data["frame_id"])
        self.assertEqual(decoded, data["signals"])
        self.assertEqual(msg_name, data["name"])

    def test_send_message_fail_conditions(self):
        # Test API response when invalid file is passed
        # The file won't contaion these CAN messages
        # DBC file must be added to database before CAN messages can be sent and received
        self.client.post('/upload/dbc', {
            'data': open('system_can.dbc', 'rb')
        }, format='multipart')

        # POST request with invalid file is sent to the API
        response = self.client.post('/transmit', json.dumps({
            "frame_id": 34,
            "name": "SET_RELAY_STATES",
            "file": "system.dbc",
            "signals": {
                "relay_mask": 25,
                "relay_state": 25
            }
        }), content_type='application/json')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(json.loads(response.content)['response'], "File does not exist")

        # Test API response when invalid signal is passed in body
        # Invalid signal will result in an encoding error
        response = self.client.post('/transmit', json.dumps({
            "frame_id": 34,
            "name": "SET_RELAY_STATES",
            "file": "system_can.dbc",
            "signals": {
                "relay_mask": 25,
            }
        }), content_type='application/json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['response'], 
                        "relay_state missing in request")

        # Test API response when an invalid message name is passed
        # The API will be unable to find the message specs from the DBC file without the correct name
        response = self.client.post('/transmit', json.dumps({
            "frame_id": 34,
            "name": "SET_RELAY",
            "file": "system_can.dbc",
            "signals": {
                "relay_mask": 25,
                "relay_state": 255
            }
        }), content_type='application/json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['response'], "Message 'SET_RELAY' does not exist")

        # Test API response when signal value passed is invalid
        # This happens when the signal value is greater than the allocated length
        response = self.client.post('/transmit', json.dumps({
            "frame_id": 34,
            "name": "SET_RELAY_STATES",
            "file": "system_can.dbc",
            "signals": {
                "relay_mask": 25,
                "relay_state": 65536
            }
        }), content_type='application/json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['response'], "relay_state value out of bounds")
