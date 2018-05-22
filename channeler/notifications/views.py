# Standard library imports.
import json

# Django imports.
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

# Third-party imports.
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

__author__ = 'Jason Parent'


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
