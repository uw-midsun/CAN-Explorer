from rest_framework import serializers
from can_server.models import DbcFile, CanSettings


class DbcFileSerializer(serializers.ModelSerializer):

    class Meta:
        model = DbcFile
        fields = ('FileName', 'FileData')

class CanSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CanSettings
        fields = ('Bustype', 'Channel', 'Bitrate')
