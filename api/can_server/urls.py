from django.conf.urls import url
from can_server import views

urlpatterns = [
    url(r'^api/can_server/raw$', views.can_msg_raw),
    url(r'^api/can_server/decoded$', views.can_msg_decoded)
]
