# Third-party imports.
from channels.generic.websocket import AsyncJsonWebsocketConsumer

__author__ = 'Jason Parent'


class EventsConsumer(AsyncJsonWebsocketConsumer):

    async def receive_json(self, content, **kwargs):
        command = content.get('command')
        student = content.get('student')
        if command == 'subscribe':
            await self.channel_layer.group_add(
                group=student,
                channel=self.channel_name
            )
            await self.send_json({
                'type': command,
                'message': f'Subscribed to \'{student}\' events.'
            })
        elif command == 'unsubscribe':
            await self.channel_layer.group_discard(
                group=student,
                channel=self.channel_name
            )
            await self.send_json({
                'type': command,
                'message': f'Unsubscribed from \'{student}\' events.'
            })

    async def broadcast_event(self, event):
        await self.send_json({
            'type': 'send',
            'registration_type': event.get('registration_type'),
            'registration_data': event.get('registration_data'),
        })
