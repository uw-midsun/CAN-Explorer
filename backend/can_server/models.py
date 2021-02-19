from django.db import models
from picklefield.fields import PickledObjectField
import jsonfield


class CanServerRaw(models.Model):
    Timestamp = models.DecimalField(decimal_places=3, max_digits=20)
    # Max value is 2^11 - 1 for 11-bit IDs and 2^29 - 1 for 29-bit IDs
    ArbitrationID = models.PositiveIntegerField()
    DLC = models.PositiveSmallIntegerField()
    Data = models.BinaryField()


class CanServerDecoded(models.Model):
    Datetime = models.DateTimeField()
    # Have to provide a max_length for CharFields
    Name = models.CharField(max_length=100)
    Sender = models.CharField(max_length=100)
    Data = PickledObjectField()
