from django.db import models
from jsonfield import JSONField


class CanServerDecoded(models.Model):
    Datetime = models.DateTimeField(blank=False)
    # Have to provide a max_length for CharFields
    Name = models.CharField(max_length=100, blank=False)
    Sender = models.CharField(max_length=100, blank=False)
    # No models exist for dicts in Django 3.0, so django-jsonfield library is
    # used
    Data = JSONField(blank=False)


class CanServerRaw(models.Model):
    Timestamp = models.DecimalField(
        blank=False, decimal_places=5, max_digits=20)
    # Max value is 2^11 - 1 for 11-bit IDs and 2^29 - 1 for 29-bit IDs
    ArbitrationID = models.PositiveIntegerField(blank=False)
    DLC = models.PositiveSmallIntegerField(blank=False)
    # For now to populate the database it is difficult to add a binary field through postman
    # so the input will become blank=False once the celery worker/websocket
    # code is merged
    Data = models.BinaryField()
