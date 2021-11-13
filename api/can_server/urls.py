from django.conf.urls import url
from django.urls import path
from can_server import views

urlpatterns = [
    path('upload/dbc', views.upload_file),
    path('read/dbc', views.read_file),
    path('upload/dbc/update', views.update_dbc_file),
    path('view/dbc', views.get_dbc_files),
    path('view/can/<str:filename>', views.get_can_messages),
    path('transmit', views.send_can_message),
    path('change_can_settings', views.change_can_settings),
    path('get_can_settings', views.get_can_settings)
]
