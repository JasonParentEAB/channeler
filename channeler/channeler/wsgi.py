# Standard library imports.
import os

# Django imports.
from django.core.wsgi import get_wsgi_application

__author__ = 'Jason Parent'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.local')

application = get_wsgi_application()
