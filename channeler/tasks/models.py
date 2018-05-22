# Django imports.
from django.db import models

__author__ = 'Jason Parent'


class Task(models.Model):

    PENDING = 'PENDING'
    SUCCESS = 'SUCCESS'
    FAILURE = 'FAILURE'

    STATUS_CHOICES = (
        (PENDING, PENDING),
        (SUCCESS, SUCCESS),
        (FAILURE, FAILURE),
    )

    objects = models.Manager()

    status = models.CharField(max_length=7, choices=STATUS_CHOICES, default=PENDING)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
