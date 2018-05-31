# Django imports.
from django.urls import path

# Third-party imports.
from channels.routing import ProtocolTypeRouter, URLRouter

# Local imports.
from events.consumers import EventsConsumer
from tasks.consumers import TasksConsumer

__author__ = 'Jason Parent'

application = ProtocolTypeRouter({
    'websocket': URLRouter([
        path('events/', EventsConsumer),
        path('tasks/', TasksConsumer),
    ])
})
