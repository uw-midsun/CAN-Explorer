from rest_framework.test import APITestCase
import can
import json

can_bus = can.interface.Bus('vcan0', bustype='socketcan')

class SendCanMessageTestCase(APITestCase):

    def test_can_message(self):
        # DBC file must be added to database before CAN messages can be sent and received
        self.client.post('/upload/dbc', {
            'data': open('system_can.dbc', 'rb')
        }, format='multipart')

        # POST request with valid parameters are sent to the API
        response = self.client.post('/transmit', json.dumps({
            "frame_id": 34,
            "name": "SET_RELAY_STATES",
            "file": "system_can.dbc",
            "signals": {
                "relay_mask": 25,
                "relay_state": 256
            }
        }), content_type='application/json')

        # We expect the message to have been sent successfully
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content)['response'], "Message sent successfully")

    def test_can_message_fail_conditions(self):
        