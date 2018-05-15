# Third-party imports.
from channels.testing import WebsocketCommunicator
import pytest

# Local imports.
from channeler.routing import application

__author__ = 'Jason Parent'


@pytest.mark.asyncio
class TestWebsocket:

    async def test_user_can_connect_to_consumer(self):
        communicator = WebsocketCommunicator(application=application, path='/notifications/')
        connected, _ = await communicator.connect()
        assert connected
        await communicator.disconnect()
