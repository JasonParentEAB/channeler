# Standard library imports.
import json

# Django imports.
from django.urls import reverse

# Third-party imports.
import pytest

# Local imports.
from ..models import Task

__author__ = 'Jason Parent'


@pytest.mark.django_db(transaction=True)
class TestHTTP:

    def test_user_can_create_sync_task(self, client):
        response = client.post(reverse('tasks:tasks'), data=json.dumps({
            'duration': 10,
            'sync': True
        }), content_type='application/json')
        response_json = response.json()
        assert response.status_code == 201
        assert response_json['id'] == 1
        assert response_json['status'] == Task.PENDING

    def test_user_can_create_async_task(self, client):
        response = client.post(reverse('tasks:tasks'), data=json.dumps({
            'duration': 10,
            'sync': False
        }), content_type='application/json')
        response_json = response.json()
        assert response.status_code == 201
        assert response_json['id'] == 2
        assert response_json['status'] == Task.PENDING

    def test_user_can_retrieve_task(self, client):
        task = Task.objects.create()
        response = client.get(reverse('tasks:tasks', kwargs={'task_id': task.id}), content_type='application/json')
        response_json = response.json()
        assert response.status_code == 200
        assert response_json['id'] == task.id
        assert response_json['status'] == task.status

    def test_user_can_list_tasks(self, client):
        Task.objects.bulk_create([Task() for _ in range(3)])
        response = client.get(reverse('tasks:tasks'), content_type='application/json')
        response_json = response.json()
        assert response.status_code == 200
        assert len(response_json) == 3

    def test_user_can_clear_all_tasks(self, client):
        tasks = Task.objects.bulk_create([Task() for _ in range(3)])
        response = client.post(reverse('tasks:clear-tasks'), content_type='application/json')
        assert response.json() == {
            'detail': f'You deleted {len(tasks)} tasks.'
        }
