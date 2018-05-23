import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { WebSocketSubject } from 'rxjs/webSocket';

import { Task, TaskService } from '../../services/task.service';

export class FormData {
  constructor(
    public duration: number = 10,
    public sync: boolean = true
  ) {}
}

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  private socket: WebSocketSubject<any>;
  data: FormData = new FormData();
  tasks: Task[];
  intervalId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private toastr: ToastrService
  ) {
    this.socket = new WebSocketSubject('ws://localhost:8000/tasks/');
  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: {tasks: Task[]}) => this.tasks = data.tasks);
    this.socket.subscribe(
      (message) => {
        if (message.hasOwnProperty('task')) {
          this.tasks[this.tasks.length - 1] = Task.create(message.task);
          this.toastr.success('I\'m done.');
        }
        else if (message.hasOwnProperty('detail')) {
          this.toastr.info(message.detail);
        }
        else {
          console.log(message);
        }
      },
      (error) => {
        console.error(error);
      },
      () => {
        console.log('WebSocket connection complete.');
      }
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.socket.unsubscribe();
  }

  createTask(): void {
    this.taskService.createTask(
      this.data.duration, 
      this.data.sync
    ).subscribe((task: Task) => {
      this.tasks.push(task);
      
      if (this.data.sync) {
        // Poll the server until the task completes.
        clearInterval(this.intervalId);
        this.intervalId = window.setInterval(() => {
          this.toastr.info('Are you done yet?');
          this.taskService.retrieveTask(task.id)
            .subscribe(task => {
              this.tasks[this.tasks.length - 1] = task;
              if (task.status !== 'PENDING') {
                clearInterval(this.intervalId);
                this.toastr.success('I\'m done.');
              }
            });
        }, 1000);
      }
      else {
        // Listen for message from the server over WebSocket.
        let group: string = `task-${task.id}`;
        this.send({'group': group});
      }
    });
  }

  onSyncResponse(task: Task): void {
    this.tasks.push(task);

    // Poll the server until the task completes.
    clearInterval(this.intervalId);
    this.intervalId = window.setInterval(() => {
      this.toastr.info('Are you done yet?');
      this.taskService.retrieveTask(task.id)
        .subscribe(task => {
          this.tasks[this.tasks.length - 1] = task;
          if (task.status !== 'PENDING') {
            clearInterval(this.intervalId);
            this.toastr.success('I\'m done.');
          }
        });
    }, 1000);
  }

  onAsyncResponse(task: Task): void {
    this.tasks.push(task);

    // Listen for message from the server over WebSocket.
    let group: string = `task-${task.id}`;
    this.send({'group': group});
  }

  clearTasks(): void {
    this.taskService.clearTasks()
      .subscribe(data => {
        this.toastr.warning(data['detail']);
        this.tasks = [];
      });
  }

  send(message: any): void {
    this.socket.next(message);
  }
}
