from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from can_server.models import CanServerRaw, CanServerDecoded
from can_server.serializers import CanServerRawSerializer, CanServerDecodedSerializer
from rest_framework.decorators import api_view


@api_view(['GET', 'POST', 'DELETE'])
def can_msg_raw(request):
    if request.method == 'GET':
        can_msg_data = CanServerRaw.objects.all()
        raw_serializer = CanServerRawSerializer(can_msg_data, many=True)
        return JsonResponse(raw_serializer.data, safe=False)
    elif request.method == 'POST':
        can_msg_data = JSONParser().parse(request)
        raw_serializer = CanServerRawSerializer(data=can_msg_data)
        if raw_serializer.is_valid():
            raw_serializer.save()
            return JsonResponse(raw_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(raw_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        count = CanServerRaw.objects.all().delete()
        return JsonResponse({'message': '{} messages were deleted successfully'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST', 'DELETE'])
def can_msg_decoded(request):
    if request.method == 'GET':
        can_msg_data = CanServerDecoded.objects.all()
        decoded_serializer = CanServerDecodedSerializer(can_msg_data, many=True)
        return JsonResponse(decoded_serializer.data, safe=False)
    elif request.method == 'POST':
        can_msg_data = JSONParser().parse(request)
        decoded_serializer = CanServerDecodedSerializer(data=can_msg_data)
        if decoded_serializer.is_valid():
            print("NICE")
            print(decoded_serializer)
            decoded_serializer.save()
            return JsonResponse(decoded_serializer.data, status=status.HTTP_201_CREATED)
        print("SAD")
        return JsonResponse(decoded_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        count = CanServerDecoded.objects.all().delete()
        return JsonResponse({'message': '{} messages were deleted successfully'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)
