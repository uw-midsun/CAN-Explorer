from django.db import models

class CanServerDecoded(models.Model):
    Datetime = models.CharField(max_length=70, blank=False, default='')
    Name = models.CharField(max_length=200, blank=False, default='')
    Sender = models.BooleanField(default=False)
    Data = models.CharField(max_length=70, blank=False, default='')

class CanServerRaw(models.Model):
    Timestamp = models.CharField(max_length=70, blank=False, default='')
    ID = models.CharField(max_length=70, blank=False, default='')
    DLC = models.CharField(max_length=70, blank=False, default='')