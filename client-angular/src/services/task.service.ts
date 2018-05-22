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
      .map((object: any) => Task.create(object));
  }

  retrieveTask(
    taskId: number
  ): Observable<Task> {
    let url: string = `http://localhost:8000/tasks/${taskId}/`;
    return this.client.get(url)
      .map((object: any) => Task.create(object));
  }

  listTasks(): Observable<Task[]> {
    let url: string = 'http://localhost:8000/tasks/';
    return this.client.get(url)
      .map((list: any[]) => {
        return list.map((element: any) => Task.create(element));
      });
  }
}