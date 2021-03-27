from django.db import models
from picklefield.fields import PickledObjectField


class CanServerDecoded(models.Model):
    Datetime = models.DateTimeField(blank=False)
    # Have to provide a max_length for CharFields
    Name = models.CharField(max_length=100, blank=False)
    Sender = models.CharField(max_length=100, blank=False)
    # No models exist for dicts in Django 3.0, so django-picklefield library
    # is used
    Data = PickledObjectField(blank=False)


class CanServerRaw(models.Model):
    # Will error only if decimal places surpasses 10 digits
    Timestamp = models.DecimalField(
        blank=False, decimal_places=10, max_digits=20)
    # Max value is 2^11 - 1 for 11-bit IDs and 2^29 - 1 for 29-bit IDs
    ArbitrationID = models.PositiveIntegerField(blank=False)
    DLC = models.PositiveSmallIntegerField(blank=False)
    Data = models.BinaryField(blank=False)
