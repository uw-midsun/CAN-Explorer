# from channels.routing import route
from can_server.consumers import CanConsumer
from channels.routing import ProtocolTypeRouter, URLRouter
from django.conf.urls import url
from channels.security.websocket import AllowedHostsOriginValidator



# channel_routing = {
#     'websocket.connect': ws_connect,
#     # 'websocket.receive': ws_message,
#     'websocket.disconnect': ws_disconnect,
# }

application = ProtocolTypeRouter({
  'websocket': AllowedHostsOriginValidator(
    URLRouter(
      [
        url("", CanConsumer)
      ]
    )
  )
})