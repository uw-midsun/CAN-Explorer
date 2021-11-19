from rest_framework import serializers
from can_server.models import DbcFile, CanSettings, SelectedDBCFile


class DbcFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DbcFile
        fields = ('FileName', 'FileData')

class CanSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CanSettings
        fields = ('bustype', 'channel', 'bitrate')

class SelectedDBCFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SelectedDBCFile
        fields = ('FileName', 'FileData')
