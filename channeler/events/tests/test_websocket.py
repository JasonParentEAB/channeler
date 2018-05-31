# Standard library imports.
import asyncio

# Third-party imports.
from channels.layers import get_channel_layer
from channels.testing import WebsocketCommunicator
from nose.tools import assert_is_not_none, assert_raises
import pytest

# Local imports.
from channeler.routing import application

__author__ = 'Jason Parent'


@pytest.mark.asyncio
class TestWebsocket:

    async def test_user_can_connect_to_consumer(self):
        communicator = WebsocketCommunicator(application=application, path='/events/')
        connected, _ = await communicator.connect()
        assert connected
        await communicator.disconnect()

    async def test_user_can_subscribe_to_event(self):
        communicator = WebsocketCommunicator(application=application, path='/events/')
        connected, _ = await communicator.connect()

        # Client subscribes to events for student.
        await communicator.send_json_to({
            'command': 'subscribe',
            'student': 'student',
        })

        response = await communicator.receive_json_from()

        # Confirmation of subscription.
        assert {
            'type': 'subscribe',
            'message': 'Subscribed to \'student\' events.',
        } == response

        channel_layer = get_channel_layer()

        # Another process broadcasts event to student group.
        await channel_layer.group_send(group='student', message={
            'type': 'broadcast.event',
            'registration_type': 'ADD',
            'registration_data': {},
        })

        response = await communicator.receive_json_from()

        # Confirmation that client receives broadcast event.
        assert {
           'type': 'send',
           'registration_type': 'ADD',
           'registration_data': {},
        } == response

        await communicator.disconnect()

    async def test_user_can_unsubscribe_from_event(self):
        communicator = WebsocketCommunicator(application=application, path='/events/')
        connected, _ = await communicator.connect()

        # Client unsubscribes from events for student.
        await communicator.send_json_to({
            'command': 'unsubscribe',
            'student': 'student',
        })

        response = await communicator.receive_json_from()

        # Confirmation of cancelled subscription.
        assert {
            'type': 'unsubscribe',
            'message': 'Unsubscribed from \'student\' events.',
        } == response

        channel_layer = get_channel_layer()

        # Another process broadcasts event to student group.
        await channel_layer.group_send(group='student', message={
            'type': 'broadcast.event',
            'registration_type': 'ADD',
            'registration_data': {},
        })

        # Client never receives the event.
        with assert_raises(asyncio.TimeoutError) as exception:
            await communicator.receive_json_from()

        assert_is_not_none(exception)

        await communicator.disconnect()
