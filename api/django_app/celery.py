from __future__ import absolute_import
import os
from celery import Celery
from django.conf import settings
from can_server.tasks import decode_and_send

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_app.settings')
app = Celery('django_app', backend='redis://', broker='redis://')

# Using a string here means the worker will not have to
# pickle the object when using Windows.
app.config_from_object(settings, namespace='CELERY')

# app.conf.broker_url = 'redis://localhost:6379/0'
# app.conf.result_backend = 'redis://localhost:6379/0'

app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


@app.on_after_configure.connect
def test(sender, **kwargs):
    sender.add_periodic_task(10, decode_and_send, name='decode_send')


if __name__ == '__main__':
    app.start()
