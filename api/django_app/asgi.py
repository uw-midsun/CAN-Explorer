"""ASGI config for django_app project"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import can_server.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_app.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            can_server.routing.websocket_urlpatterns
        )
    )
})
