# Django imports.
from django.urls import path

# Local imports.
from .views import ClearTasksView, TasksView

__author__ = 'Jason Parent'

urlpatterns = [
    path('', TasksView.as_view({
        'get': 'list',
        'post': 'create'
    }), name='tasks'),
    path('<int:task_id>/', TasksView.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    }), name='tasks'),
    path('clear/', ClearTasksView.as_view(), name='clear-tasks'),
]
