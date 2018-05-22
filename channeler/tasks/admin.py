# Django imports.
from django.contrib import admin

# Local imports.
from .models import Task

__author__ = 'Jason Parent'


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    fields = ('id', 'status', 'created', 'updated',)
    readonly_fields = ('id', 'created', 'updated',)
    list_display = ('id', 'status', 'created', 'updated',)
    list_filter = ('status',)
    ordering = ('id',)
