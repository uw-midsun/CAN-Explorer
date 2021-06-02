from rest_framework import serializers
from can_server.models import DbcFile


class DbcFileSerializer(serializers.ModelSerializer):

    class Meta:
        model = DbcFile
        fields = ('FileName', 'FileData',)
