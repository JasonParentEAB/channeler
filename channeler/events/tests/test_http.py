# Standard library imports.
import json

# Django imports.
from django.urls import reverse

# Third-party imports.
import pytest

__author__ = 'Jason Parent'


@pytest.mark.django_db(transaction=True)
class TestHTTP:

    def test_user_can_broadcast_registration_event(self, client):
        response = client.post(reverse('events:events'), data=json.dumps({
            'student': 'student',
            'registration_type': 'ADD',
            'registration_data': {},
        }), content_type='application/json')
        response_json = response.json()
        assert response.status_code == 200
        assert response_json == {}
