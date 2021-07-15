from rest_framework.test import APITestCase
import json

class CanSettingsTestCase(APITestCase):

    def test_get_can_settings(self):
        response = self.client.get('/get_can_settings')

        self.assertEqual(response.status_code, 200)
    
    def test_change_can_settings(self):
        response = self.client.put('/change_can_settings', {
            'bustype': 'socketcan',
            'channel': 'vcan0',
            'bitrate': 80000
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content)['response'], "Settings changed successfully")

    def test_change_can_settings_fail_bustype(self):
        response = self.client.put('/change_can_settings', {
            'bustype': 2223,
            'channel': 'vcan0',
            'bitrate': 80000
        })

        self.assertEqual(response.status_code, 500)
        self.assertEqual(json.loads(response.content)['response'], "An error occurred while saving CAN settings")

    def test_change_can_settings_fail_channel(self):
        response = self.client.put('/change_can_settings', {
            'bustype': 'socketcan',
            'channel': 2222,
            'bitrate': 80000
        })

        self.assertEqual(response.status_code, 500)
        self.assertEqual(json.loads(response.content)['response'], "An error occurred while saving CAN settings")

    def test_change_can_settings_fail_bitrate(self):
        response = self.client.put('/change_can_settings', {
            'bustype': 'socketcan',
            'channel': 'vcan0',
            'bitrate': -1
        })

        self.assertEqual(response.status_code, 500)
        self.assertEqual(json.loads(response.content)['response'], "An error occurred while saving CAN settings")
    
