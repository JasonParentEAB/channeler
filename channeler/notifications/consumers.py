# Third-party imports.
from channels.generic.websocket import AsyncJsonWebsocketConsumer

__author__ = 'Jason Parent'


class NotificationsConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        await super().connect()

    async def disconnect(self, code):
        await super().disconnect(code)
