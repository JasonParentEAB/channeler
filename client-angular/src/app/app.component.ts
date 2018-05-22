import { Component } from '@angular/core';
import { TaskService } from '../services/task.service';

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
export class AppComponent {
  title = 'app';
  data: FormData = new FormData();

  constructor(private taskService: TaskService) {}

  createTask(): void {
    this.taskService.createTask(
      this.data.duration, 
      this.data.sync
    ).subscribe(data => {
      console.log(data);
    });
  }
}
