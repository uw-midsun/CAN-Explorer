from rest_framework import serializers
from can_server.models import CanServer

class CanServerSerializer(serializers.ModelSerializer):

    class Meta:
        model = CanServer
        fields = ('id', 'title', 'description', 'published')