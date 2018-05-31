# Third-party imports.
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import response, status, views

__author__ = 'Jason Parent'


class EventsView(views.APIView):

    def post(self, request, *args, **kwargs):
        student = request.data.get('student')
        message = {
            'type': 'broadcast.event',
            'registration_type': request.data.get('registration_type'),
            'registration_data': request.data.get('registration_data'),
        }
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            group=student,
            message=message
        )
        return response.Response(data={}, status=status.HTTP_200_OK)
