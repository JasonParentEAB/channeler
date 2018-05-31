# Django imports.
from django.urls import path

# Local imports.
from .views import EventsView

__author__ = 'Jason Parent'

urlpatterns = [
    path('', EventsView.as_view(), name='events'),
]
