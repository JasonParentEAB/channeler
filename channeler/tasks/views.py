# Standard library imports.
import json
import time

# Django imports.
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

# Third-party imports.
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import django_rq

# Local imports.
from .models import Task

__author__ = 'Jason Parent'

DEFAULT_DURATION = 5


def create_task(*, task_id, duration=DEFAULT_DURATION, sync=True):
    task = Task.objects.get(id=task_id)
    time.sleep(duration)
    task.status = Task.SUCCESS
    task.save()
    if not sync:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(group=f'task-{task_id}', message={
            'type': 'task.status',
            'status': task.status,
        })


@method_decorator(csrf_exempt, name='dispatch')
class TasksView(View):

    def get(self, request, task_id=None, *args, **kwargs):
        task = Task.objects.get(id=task_id)
        return JsonResponse(status=200, data={
            'id': task.id,
            'status': task.get_status_display(),
            'created': task.created,
            'updated': task.updated,
        })

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        task = Task.objects.create()
        django_rq.enqueue(
            create_task,
            task_id=task.id,
            duration=int(data.get('duration', DEFAULT_DURATION)),
            sync=bool(int(data.get('sync', 1)))
        )
        return JsonResponse(status=202, data={
            'id': task.id,
            'status': task.get_status_display(),
            'created': task.created,
            'updated': task.updated,
        })
