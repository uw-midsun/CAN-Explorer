from django.shortcuts import render
from django.http import HttpResponse

from . import aggregate_can_data

def index(request):
    # can_messages = {}
    # aggregate_can_data.decode_and_send()
    return render(request, "frontend.html")
    # while(True):
    #     aggregate_can_data.decode_and_send()