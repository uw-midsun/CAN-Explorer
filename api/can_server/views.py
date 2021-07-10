from django.http.response import JsonResponse
from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework import status
from rest_framework.decorators import api_view
import cantools
import can
import json

from can_server.models import DbcFile
from can_server.serializers import DbcFileSerializer

ALREADY_EXISTS_ERROR = "dbc file with this FileName already exists."


@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_file(request):
    # Get dbc file as bytes
    file = request.FILES['data']
    dbc_file_data = file.read()

    # Django BinaryField is buggy so dbc file contents are stored as a TextField
    db_input = {'FileName': file.name, 'FileData': dbc_file_data.decode('utf-8')}
    dbc_serializer = DbcFileSerializer(data=db_input)
    if dbc_serializer.is_valid():
        dbc_serializer.save()
    else:
        # Error occurs when an already existing file name is used
        # In the future this response will allow frontend to create confirmation message and update database
        if 'FileName' in dbc_serializer.errors and dbc_serializer.errors['FileName'][0] == ALREADY_EXISTS_ERROR:
            return JsonResponse(
                {'response': 'Filename Already Exists'},
                status=400
            )
        return JsonResponse(
            {'response': 'Unable to Serialize DBC File'},
            status=500
        )

    return JsonResponse(
                {'response': 'DBC File Stored Successfully'},
                status=201
            )


@api_view(['PATCH'])
@parser_classes([MultiPartParser])
def update_dbc_file(request):
    # Get dbc file as bytes
    file = request.FILES['data']
    dbc_file_data = file.read()

    try:
        dbc_file = DbcFile.objects.get(FileName=file.name)
        dbc_file.FilData = dbc_file_data.decode('utf-8')
        dbc_file.save()
    except DbcFile.DoesNotExist as e:
        return JsonResponse(
            {'response': 'File does not exist'},
            status=404
        )

    return JsonResponse(
                {'response': 'DBC File Updated Successfully'},
                status=201
            )    


@api_view(['GET'])
def get_dbc_files(request):
    dbc_files = DbcFile.objects.all()
    dbc_file_serializer = DbcFileSerializer(dbc_files, many=True)
    files_list = []
    for entry in dbc_file_serializer.data:
        db = cantools.database.load_string(entry['FileData'])
        files_list.append(entry['FileName'])
    return JsonResponse(
                {'response': files_list},
                status=200
            )


@api_view(['GET'])
def get_can_messages(request, filename):
    try:
        dbc_file = DbcFile.objects.get(FileName=filename)
    except DbcFile.DoesNotExist as e:
        return JsonResponse(
            {'response': 'File does not exist'},
            status=404
        )

    dbc_file_serializer = DbcFileSerializer(dbc_file)
    dbc_file_db = cantools.database.load_string(dbc_file_serializer.data['FileData'])

    can_message_dict = {}
    for msg in dbc_file_db.messages:
        can_message_dict[msg.frame_id] = {"name": msg.name, "signals": {}}
        for sig in msg.signals:
            can_message_dict[msg.frame_id]["signals"][sig.name] = sig.length

    return JsonResponse(
                {'response': can_message_dict},
                status=200
    )


@api_view(['POST'])
@parser_classes([JSONParser])
def send_can_message(request):
    can_bus = can.interface.Bus('vcan0', bustype='socketcan')
    print(request.data)
