from django.conf.urls import url
from can_server import views

urlpatterns = [
    url(r'^api/can_server$', views.can_msg_list)
]