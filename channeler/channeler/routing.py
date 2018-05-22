# Django imports.
from django.urls import path

# Third-party imports.
from channels.routing import ProtocolTypeRouter, URLRouter

# Local imports.
from notifications.consumers import NotificationsConsumer
from tasks.consumers import TasksConsumer

__author__ = 'Jason Parent'

application = ProtocolTypeRouter({
    'websocket': URLRouter([
        path('notifications/', NotificationsConsumer),
        path('tasks/', TasksConsumer),
    ])
})
