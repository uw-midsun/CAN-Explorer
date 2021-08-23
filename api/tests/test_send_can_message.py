from rest_framework.test import APITestCase
import can

can_bus = can.interface.Bus('vcan0', bustype='socketcan')

class SendCanMessageTestCase(APITestCase):

    def test_can_message(self):

        reponse = self.client.post('/transmit', {
            'data': {
                "frame_id": 34,
                "name": "SET_RELAY_STATES",
                "file": "system_can.dbc",
                "signals": {
                    "relay_mask": 25,
                    "relay_state": 256
                }
            }
        }, format='json')

        print(response.content)
