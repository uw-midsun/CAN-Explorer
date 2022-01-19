# Generated by Django 3.0 on 2021-11-19 03:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('can_server', '0004_dbcfile_selected'),
    ]

    operations = [
        migrations.CreateModel(
            name='SelectedDBCFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='dbcfile',
            name='Selected',
        ),
    ]