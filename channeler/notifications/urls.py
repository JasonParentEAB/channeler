# Django imports.
from django.urls import path

# Local imports.
from .views import EventsView, TasksView

__author__ = 'Jason Parent'

urlpatterns = [
    path('events/', EventsView.as_view(), name='events'),
    path('tasks/', TasksView.as_view(), name='tasks'),
    path('tasks/<int:task_id>/', TasksView.as_view(), name='tasks'),
]
