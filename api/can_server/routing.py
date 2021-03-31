# chat/routing.py
from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    path('ws/can_server/converted', consumers.ConvertConsumer.as_asgi()),
    path('ws/can_server/raw', consumers.RawConsumer.as_asgi()),
]