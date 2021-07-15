from django.conf.urls import url
from can_server import views

urlpatterns = [
    url(r'^upload/dbc', views.upload_file),
    url(r'^view/dbc', views.get_dbc_files),
    url(r'^change_can_settings', views.change_can_settings),
    url(r'^get_can_settings', views.get_can_settings),
]
