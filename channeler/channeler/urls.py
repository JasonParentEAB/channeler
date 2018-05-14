# Django imports.
from django.contrib import admin
from django.urls import path

__author__ = 'Jason Parent'

urlpatterns = [
    path('admin/', admin.site.urls),
]
