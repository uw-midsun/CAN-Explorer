from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    # path('converted', views.start, name='converted'),
    # path('raw', views.raw, name='raw'),
]