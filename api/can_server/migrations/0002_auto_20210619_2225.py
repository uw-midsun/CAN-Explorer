# Generated by Django 3.0 on 2021-06-19 22:25

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('can_server', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='dbcfile',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dbcfile',
            name='updated',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
