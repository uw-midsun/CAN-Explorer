'''from django.test import TestCase
from pymongo import MongoClient
from can_server.models import CanServerDecoded, CanServerRaw
from django_app import tasks
import cantools
import can
import time
import random

num_messages = 10
can_messages = []

can_bus = can.interface.Bus('vcan0', bustype='socketcan')
can_db = cantools.database.load_file('system_can.dbc')

client = MongoClient('localhost', 27017)
db = client.can_data_db


class MessageStorageTestCase(TestCase):
    def setUp(self):

    def test_decoded_message_storage(self):'''
        
