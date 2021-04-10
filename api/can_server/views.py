from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from can_server.models import CanServerRaw, CanServerDecoded
from can_server.serializers import CanServerRawSerializer, CanServerDecodedSerializer  # noqa: E501
from rest_framework.decorators import api_view

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

channel_layer = get_channel_layer()

@api_view(['GET', 'POST', 'DELETE'])
def can_msg_raw(request):
    if request.method == 'GET':
        # Gets all objects from CanServerRaw collection
        can_msg_data = CanServerRaw.objects.all()
        raw_serializer = CanServerRawSerializer(can_msg_data, many=True)
        # Deserialize data to view in frontend
        return JsonResponse(raw_serializer.data, safe=False)
    # POST method will be removed once celery worker/websockets is merged but
    # I needed a way to test django model fields
    elif request.method == 'POST':
        # Convert data to json format
        can_msg_data = JSONParser().parse(request)
        print(can_msg_data)
        raw_serializer = CanServerRawSerializer(data=can_msg_data)

        # Stream to websockets
        async_to_sync(channel_layer.group_send)
        ("raw",
        {"type": "websocket_receive",
        'timestamp': can_msg_data["Timestamp"],
        'dlc': can_msg_data["DLC"],
        'channel': can_msg_data["Channel"],
        'data': can_msg_data["Data"]})

        if raw_serializer.is_valid():
            # Save the object to the database in the CanServerRaw collection
            raw_serializer.save()
            return JsonResponse(
                raw_serializer.data,
                status=status.HTTP_201_CREATED)
        return JsonResponse(
            raw_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST)
    # Exists for testing purposes can query the database to delete stuff later
    elif request.method == 'DELETE':
        count = CanServerRaw.objects.all().delete()
        return JsonResponse({'message': '{} messages were deleted successfully'.format(  # noqa: E501
            count[0])}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST', 'DELETE'])
def can_msg_decoded(request):
    if request.method == 'GET':
        # Gets all objects from CanServerDecoded collection
        can_msg_data = CanServerDecoded.objects.all()
        decoded_serializer = CanServerDecodedSerializer(
            can_msg_data, many=True)
        # Deserialize data to view in frontend
        return JsonResponse(decoded_serializer.data, safe=False)
    # POST method will be removed once celery worker/websockets is merged but
    # I needed a way to test django model fields
    elif request.method == 'POST':
        # Convert data t json format
        can_msg_data = JSONParser().parse(request)
        decoded_serializer = CanServerDecodedSerializer(data=can_msg_data)

        # async_to_sync(channel_layer.group_send)
        # ("converted",
        # {"type": "websocket_receive",
        # 'datetime': can_msg_data['Timestamp'],
        # 'name': can_msg_data["name"],
        # 'sender': sender,
        # 'data': decoded})

        if decoded_serializer.is_valid():
            # Save the object to the database in the CanServerDecoded
            # collection
            decoded_serializer.save()
            return JsonResponse(
                decoded_serializer.data,
                status=status.HTTP_201_CREATED)
        return JsonResponse(
            decoded_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST)
    # Exists for testing purposes can query the database to delete stuff later
    elif request.method == 'DELETE':
        count = CanServerDecoded.objects.all().delete()
        return JsonResponse({'message': '{} messages were deleted successfully'.format(  # noqa: E501
            count[0])}, status=status.HTTP_204_NO_CONTENT)

def ws_test(request):
    return render(request, "frontend.html")
