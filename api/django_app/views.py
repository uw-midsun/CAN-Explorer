from django.shortcuts import render
from django.http import HttpResponse

from . import urls

def index(request):
    return HttpResponse("Here are the possible paths:\n" + str(urls.urlpatterns))