import asyncio
import json
from channels.consumer import AsyncConsumer
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
# from . import aggregate_can_data


class ConvertConsumer(WebsocketConsumer):
    def websocket_connect(self, event):
        print('connected', event)
        async_to_sync(self.channel_layer.group_add)(
            "converted", self.channel_name)
        self.accept()

    def websocket_receive(self, event):
        # print(type(event))
        # can_json = json.loads(event)
        can_json_str = json.dumps(event)
        # print(f"can json str {type(can_json_str)}")
        # can_json = json.loads(can_json_str)
        # can_date = can_json['datetime']
        #print("event is ")
        # print(event['datetime'])
        async_to_sync(self.channel_layer.group_send)(
            "converted",
            {
                'type': 'can_message',  # same name as function in class
                'msg': can_json_str
            }
        )
        # print(f"can date is {can_date}")

    def can_message(self, event):
        self.send(text_data=event['msg'])

    def websocket_disconnect(self, event):
        print('disconnected', event)
        async_to_sync(self.channel_layer.group_discard)(
            "converted", self.channel_name)


class RawConsumer(WebsocketConsumer):
    def websocket_connect(self, event):
        print('connected', event)
        async_to_sync(self.channel_layer.group_add)("raw", self.channel_name)
        self.accept()

    def websocket_receive(self, event):
        print(event)

        can_json_str = json.dumps(event)
        print(can_json_str)
        async_to_sync(self.channel_layer.group_send)(
            "raw",
            {
                'type': 'can_message',
                'msg': can_json_str
            }
        )

    def can_message(self, event):
        self.send(text_data=event['msg'])

    def websocket_disconnect(self, event):
        print('disconnected', event)
        async_to_sync(self.channel_layer.group_discard)(
            "raw", self.channel_name)
