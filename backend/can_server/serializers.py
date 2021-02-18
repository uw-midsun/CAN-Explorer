from rest_framework import serializers
from can_server.models import CanServerDecoded, CanServerRaw

class CanServerDecodedSerializer(serializers.ModelSerializer):

    class Meta:
        model = CanServerDecoded
        fields = ('Datetime', 'Name', 'Sender', 'Data')


class CanServerRawSerializer(serializers.ModelSerializer):

    class Meta:
        model = CanServerRaw
        fields = ('Timestamp', 'ID', 'DLC')