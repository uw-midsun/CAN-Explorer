# chat/routing.py
from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    path('ws/can_server/', consumers.CanConsumer.as_asgi()),
]