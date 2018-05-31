# Django Channels

Building Better Navigate Features with Bidirectional APIs

---

## Road Map

1. Django Channels Overview
1. Simple Example: Polling
1. Navigate Example: Course Registration

---

## Django Channels Overview

---

## Simple Example: Polling

---

### Example

---

### Code: HTTP (1/3)

```python
urlpatterns = [
    path('', TasksView.as_view(), name='tasks'),
]
```

---

### Code: HTTP (2/3)

```python
class TasksView(viewsets.ModelViewSet):

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_url_kwarg = 'task_id'

    def perform_create(self, serializer):
        task = serializer.save()
        django_rq.enqueue(
            create_task,
            task_id=task.id,
            duration=self.request.data.get('duration')
        )
```

---

### Code: HTTP (3/3)

```python
def create_task(*, task_id, duration):
    # Sleep for a while to simulate long-running task.
    time.sleep(duration)

    # Update task.
    task = Task.objects.get(id=task_id)
    task.status = Task.SUCCESS
    task.save()

    # Push data to client over WebSocket.
    group = f'task-{task_id}'
    message = {
        'type': 'task.status',
        'task': TaskSerializer(task).data,
    }
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        group=group,
        message=message
    )
```

---

### Code: WebSocket (1/2)

```python
application = ProtocolTypeRouter({
    'websocket': URLRouter([
        path('tasks/', TasksConsumer),
    ])
})
```

---

### Code: WebSocket (2/2)

```python
class TasksConsumer(AsyncJsonWebsocketConsumer):

    async def receive_json(self, content, **kwargs):
        group = content.get('group')
        await self.channel_layer.group_add(
            group=group, 
            channel=self.channel_name
        )
        await self.send_json({
            'detail': f'Added to group {group}.'
        })

    async def task_status(self, event):
        await self.send_json({
            'task': event['task'],
        })
```

---

## Navigate Example: Course Registration

---

### Example