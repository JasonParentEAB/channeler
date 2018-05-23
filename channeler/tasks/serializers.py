# Third-party imports.
from rest_framework import serializers

# Local imports.
from .models import Task

__author__ = 'Jason Parent'


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ('id', 'status', 'created', 'updated',)
