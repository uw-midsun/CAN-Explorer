import asyncio
from django.shortcuts import render
from django.http import HttpResponse
from asgiref.sync import sync_to_async, async_to_sync

# from . import aggregate_can_data

def index(request):
    return render(request, "frontend.html")


# def converted(request):
#     return render(request, "frontend.html")


# def raw(request):
#     return render(request, "frontend.html")
