"""django_app URL Configuration"""

from django.conf.urls import url, include

urlpatterns = [
    url(r'^', include('can_server.urls'))
]
