# Django imports.
from django.urls import path

# Local imports.
from .views import TasksView

__author__ = 'Jason Parent'

urlpatterns = [
    path('', TasksView.as_view(), name='tasks'),
    path('<int:task_id>/', TasksView.as_view(), name='tasks'),
]
