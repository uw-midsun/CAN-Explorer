import asyncio
import json
from channels.consumer import AsyncConsumer
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from . import aggregate_can_data


class CanConsumer(WebsocketConsumer):
    def websocket_connect(self, event):
        print('connected', event)
        async_to_sync(self.channel_layer.group_add)("can_server", self.channel_name)
        self.accept()
        while(True):
            aggregate_can_data.decode_and_send()

    def websocket_receive(self, event):
        # can_json = json.loads(event)
        # can_date = can_json['datetime']
        print("event is ")
        print(event['datetime'])
        async_to_sync(self.channel_layer.group_send)(
            "can_server",
            {
                'type': 'can_message',
                'msg': "broski"
            }
        )
        # print(f"can date is {can_date}")
    
    def can_message(self, event):
        self.send(text_data=event['msg'])

    def websocket_disconnect(self, event):
        print('disconnected', event)
        async_to_sync(self.channel_layer.group_discard)("can_server", self.channel_name)
