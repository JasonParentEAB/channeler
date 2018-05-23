import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

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
  data: FormData = new FormData();
  tasks: Task[];
  intervalId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.data
      .subscribe((data: {tasks: Task[]}) => this.tasks = data.tasks);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  createTask(): void {
    this.taskService.createTask(
      this.data.duration, 
      this.data.sync
    ).subscribe(task => {
      this.tasks.push(task);
      if (this.data.sync) {
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
    });
  }

  clearTasks(): void {
    this.taskService.clearTasks()
      .subscribe(data => {
        this.toastr.warning(data['detail']);
        this.tasks = [];
      });
  }
}
