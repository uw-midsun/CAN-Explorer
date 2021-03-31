"""ASGI config for django_app project"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
import can_server.routing
# import channels.asgi

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_app.settings')
# channel_layer = channels.asgi.get_channel_layer()

# application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    'websocket': AuthMiddlewareStack(
      URLRouter(
          can_server.routing.websocket_urlpatterns
      )
  )
})
