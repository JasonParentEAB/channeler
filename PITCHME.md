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
class TasksView(generics.CreateAPIView):

    queryset = Task.objects.all()
    serializer_class = TaskSerializer

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

### Code: WebSocket (1/3)

```python
application = ProtocolTypeRouter({
    'websocket': URLRouter([
        path('tasks/', TasksConsumer),
    ])
})
```

---

### Code: WebSocket (2/3)

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

    async def task_status(self, event): ...
```

---

### Code: WebSocket (3/3)

```python
class TasksConsumer(AsyncJsonWebsocketConsumer):

    async def receive_json(self, content, **kwargs): ...

    async def task_status(self, event):
        await self.send_json({
            'task': event['task'],
        })
```

---

## Navigate Example: Course Registration

---

### Example

---

### Code: WebSocket (1/3)

```python
application = ProtocolTypeRouter({
    'websocket': URLRouter([
        path('events/', EventsConsumer),
    ])
})
```

---

### Code: WebSocket (2/3)

```python
class EventsConsumer(AsyncJsonWebsocketConsumer):

    async def receive_json(self, content):
        command = content.get('command')
        student = content.get('student')

        # Client subscribes to events for a student.
        if command == 'subscribe':
            await self.channel_layer.group_add(
                group=student,
                channel=self.channel_name
            )
            await self.send_json({
                'type': command,
                'message': f'Subscribed to {student} events.'
            })

    async def broadcast_event(self, event): ...
```

--- 

### Code: WebSocket (3/3)

```python
class EventsConsumer(AsyncJsonWebsocketConsumer):

    async def receive_json(self, content): ...

    async def broadcast_event(self, event):
        await self.send_json({
            'type': 'send',
            'registration_type': event.get('registration_type'),
            'registration_data': event.get('registration_data'),
        })
```

---

### Code: Server

```python
student_nk = student.nk
message = {
    'type': 'broadcast.event',
    'registration_type': 'SUCCESS',
    'registration_data': {
        # Section data...
    },
}
channel_layer = get_channel_layer()
async_to_sync(channel_layer.group_send)(
    group=student_nk,
    message=message
)
```

---

### Code: UI (1/3)

```typescript
import { WebSocketSubject } from 'rxjs/webSocket';

export class ChannelerService {

  private socket: WebSocketSubject<any>;

  /**
  Initialize WebSocket handshake.
  Connect to WebSocket.
  Process incoming events from server.
  */
  subscribe(): void {
    if (!this.socket || this.socket.closed) {
      this.socket = new WebSocketSubject(WEBSOCKET_URL);
      this.socket.subscribe(
        (message) => {
          // Receive data pushed from the server.
        }
      );
    }
  }

  send(message: any): void {...}

  unsubscribe(): void {...}
}
```

---

### Code: UI (2/3)

```typescript
import { WebSocketSubject } from 'rxjs/webSocket';

export class ChannelerService {

  private socket: WebSocketSubject<any>;

  subscribe(): void {...}

  send(message: any): void {...}

  /**
  Disconnect from WebSocket.
  */
  unsubscribe(): void {
    if (!this.socket || this.socket.closed) {
      this.socket.unsubscribe();
    }
  }
```

---

### Code: UI (3/3)

```typescript
import { WebSocketSubject } from 'rxjs/webSocket';

export class ChannelerService {

  private socket: WebSocketSubject<any>;

  subscribe(): void {...}

  /**
  Send data to server over WebSocket connection.
  */
  send(message: any): void {
    this.socket.next(message);
  }

  unsubscribe(): void {...}
```