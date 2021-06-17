from django.db import models


class DbcFile(models.Model):
    FileName = models.CharField(primary_key=True, max_length=100, blank=False)
    FileData = models.TextField(blank=False)

class CanSettings(models.Model):
    Bustype = models.CharField(blank=False, max_length=100)
    Channel = models.CharField(blank=False, max_length=100)
    Bitrate = models.IntegerField(blank=False)
