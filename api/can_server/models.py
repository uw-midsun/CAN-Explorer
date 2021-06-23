from django.db import models


class DbcFile(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    FileName = models.CharField(primary_key=True, max_length=100, blank=False)
    FileData = models.TextField(blank=False)

class CanSettings(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    bustype = models.CharField(blank=False, max_length=100)
    channel = models.CharField(blank=False, max_length=100)
    bitrate = models.IntegerField(blank=False)
