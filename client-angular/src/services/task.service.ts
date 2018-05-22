import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class Task {
  constructor(
    public id: number,
    public status: string,
    public created: Date,
    public updated: Date
  ) {}

  static create(data: any): Task {
    return new Task(
      data.id,
      data.status,
      new Date(data.created),
      new Date(data.updated)
    );
  }
}

@Injectable()
export class TaskService {
  constructor(private client: HttpClient) {}

  createTask(
    duration: number = 10, 
    sync: boolean = true
  ): Observable<Task> {
    let url: string = 'http://localhost:8000/tasks/';
    return this.client.post(url, {duration, sync})
      .map(data => Task.create(data));
  }
}