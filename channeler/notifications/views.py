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


@method_decorator(csrf_exempt, name='dispatch')
class EventsView(View):

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(group=data.get('group'), message={
            'type': 'notifications.event',
            'name': data.get('name'),
            'data': data.get('data'),
        })
        return JsonResponse({}, status=200)


def create_task(task_id, duration=DEFAULT_DURATION):
    task = Task.objects.get(id=task_id)
    time.sleep(duration)
    task.status = Task.SUCCESS
    task.save()


@method_decorator(csrf_exempt, name='dispatch')
class TasksView(View):

    def get(self, request, task_id=None, *args, **kwargs):
        pass

    def post(self, request, *args, **kwargs):
        pass
