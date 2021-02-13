from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from can_server.models import CanServer
from can_server.serializers import CanServerSerializer
from rest_framework.decorators import api_view


@api_view(['GET', 'POST', 'DELETE'])
def can_msg_list(request):
    if request.method == 'GET':
        can_msg_data = CanServer.objects.all()
        title = request.GET.get('title', None)
        if title:
            can_msg_data = can_msg_data.filter(title__icontains=title)
        can_server_serializer = CanServerSerializer(can_msg_data, many=True)
        return JsonResponse(can_server_serializer.data, safe=False)
    elif request.method == 'POST':
        can_msg_data = JSONParser().parse(request)
        can_server_serializer = CanServerSerializer(data=can_msg_data)
        if can_server_serializer.is_valid():
            can_server_serializer.save()
            return JsonResponse(can_server_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(can_server_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        count = CanServer.objects.all().delete()
        return JsonResponse({'message': '{} messages were deleted successfully'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)
