from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

def validate_alpha(value):
    if not any(c.isalpha() for c in value):
        raise ValidationError(
            f'{value} must contain alphabetical characters'
        )

class DbcFile(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    FileName = models.CharField(primary_key=True, max_length=100, blank=False)
    FileData = models.TextField(blank=False)

class CanSettings(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    # bustype and channel must have letters
    bustype = models.CharField(blank=False, max_length=100, validators=[validate_alpha])
    channel = models.CharField(blank=False, max_length=100, validators=[validate_alpha])
    bitrate = models.IntegerField(blank=False, validators=[MinValueValidator(0)])

class SelectedDBCFile(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    FileName = models.CharField(primary_key=True, max_length=100, blank=False)
    FileData = models.TextField(blank=False)
