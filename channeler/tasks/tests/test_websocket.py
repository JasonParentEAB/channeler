# Third-party imports.
from channels.layers import get_channel_layer
from channels.testing import WebsocketCommunicator
import pytest

# Local imports.
from ..models import Task
from channeler.routing import application

__author__ = 'Jason Parent'


@pytest.mark.asyncio
class TestWebsocket:

    async def test_user_can_connect_to_tasks_consumer(self):
        communicator = WebsocketCommunicator(application=application, path='/tasks/')
        connected, _ = await communicator.connect()
        assert connected
        await communicator.disconnect()

    async def test_user_can_subscribe_to_task_group(self, client):
        communicator = WebsocketCommunicator(application=application, path='/tasks/')
        connected, _ = await communicator.connect()

        group = 'task-1'

        await communicator.send_json_to({
            'group': group
        })
        response = await communicator.receive_json_from()

        assert {
            'detail': f'Added to group {group}.'
        } == response

        channel_layer = get_channel_layer()
        await channel_layer.group_send(group=group, message={
            'type': 'task.status',
            'status': Task.SUCCESS,
        })

        response = await communicator.receive_json_from()

        assert {
            'status': Task.SUCCESS,
        } == response

        await communicator.disconnect()
