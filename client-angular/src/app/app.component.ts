import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task, TaskService } from '../services/task.service';

export class FormData {
  constructor(
    public duration: number = 10,
    public sync: boolean = true
  ) {}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  data: FormData = new FormData();
  tasks: Task[];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.route.data
      .subscribe((data: {tasks: Task[]}) => this.tasks = data.tasks);
  }

  createTask(): void {
    this.taskService.createTask(
      this.data.duration, 
      this.data.sync
    ).subscribe(task => {
      this.tasks.push(task);
    });
  }
}
