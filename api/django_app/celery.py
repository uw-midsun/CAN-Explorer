from __future__ import absolute_import
import os
from celery import Celery
from django.conf import settings
from django_app.tasks import decode_and_send

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_app.settings')
app = Celery('django_app', backend='redis://', broker='redis://')

app.config_from_object(settings, namespace='CELERY')

app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


@app.on_after_configure.connect
def task_decode_send(sender, **kwargs):
    sender.add_periodic_task(1, decode_and_send, name='decode_send')


if __name__ == '__main__':
    app.start()
