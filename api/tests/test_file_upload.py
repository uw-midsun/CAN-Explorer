from rest_framework.test import APITestCase
import cantools
import json

from can_server.models import DbcFile
from can_server.serializers import DbcFileSerializer

db = cantools.database.load_file('system_can.dbc')


class FileUploadTestCase(APITestCase):

    def test_file_upload(self):
        # Test whether uploaded DBC file messages are not altered during storage
        # Make API request to add the DBC file to the database
        response = self.client.post('/upload/dbc', {
            'data': open('system_can.dbc', 'rb')
        }, format='multipart')
        # Get uploaded file from database
        dbc_files = DbcFile.objects.all()
        dbc_file_serializer = DbcFileSerializer(dbc_files, many=True)

        # Validate that correct Json response is received
        self.assertEqual(response.status_code, 201)
        self.assertEqual(json.loads(response.content)['response'], "DBC File Stored Successfully")

        # Validate file name stored in database
        dbc_file_db = cantools.database.load_string(dbc_file_serializer.data[0]['FileData'])
        self.assertEqual(dbc_file_serializer.data[0]['FileName'], 'system_can.dbc')

        # Validate CAN messages stored in database
        for i in range(len(dbc_file_db.messages)):
            message = db.messages[i]
            new_message = dbc_file_db.messages[i]
            self.assertEqual(new_message.name, message.name)
            self.assertEqual(new_message.frame_id, message.frame_id)
            self.assertEqual(new_message.length, message.length)
            self.assertEqual(new_message.is_extended_frame, message.is_extended_frame)

    def test_fail_conditions(self):
        # Test API response when same file name is uploaded to database
        # Make API requests to add two DBC file to the database
        # It will fail since file name of both are the same 
        self.client.post('/upload/dbc', {
            'data': open('system_can.dbc', 'rb')
        }, format='multipart')
        response = self.client.post('/upload/dbc', {
            'data': open('system_can.dbc', 'rb')
        }, format='multipart')

        # Validate that correct Json response is received
        self.assertEqual(response.status_code, 400)
        self.assertEqual(json.loads(response.content)['response'], 'Filename Already Exists')        
