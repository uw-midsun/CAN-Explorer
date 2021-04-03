from can_server.consumers import ConvertConsumer
from channels.routing import ProtocolTypeRouter, URLRouter
from django.conf.urls import url
from channels.security.websocket import AllowedHostsOriginValidator

# TODO check if still needed
application = ProtocolTypeRouter({
    'websocket': AllowedHostsOriginValidator(
        URLRouter(
            [
                url("", ConvertConsumer)
            ]
        )
    )
})
