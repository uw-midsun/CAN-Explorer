from rest_framework import serializers
from can_server.models import CanServerDecoded, CanServerRaw


class CanServerRawSerializer(serializers.ModelSerializer):

    class Meta:
        model = CanServerRaw
        fields = ('Timestamp', 'ArbitrationID', 'DLC', 'Data')


class CanServerDecodedSerializer(serializers.ModelSerializer):

    class Meta:
        model = CanServerDecoded
        fields = ('Datetime', 'Name', 'Sender', 'Data')
