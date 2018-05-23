import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';


const DEFAULT_DATETIME_FORMAT = 'MMMM Do YYYY, h:mm:ss a';

export class Task {
  constructor(
    public id: number,
    public status: string,
    public created: string,
    public updated: string
  ) {}

  static create(data: any): Task {
    return new Task(
      data.id,
      data.status,
      moment(data.created).format(DEFAULT_DATETIME_FORMAT),
      moment(data.updated).format(DEFAULT_DATETIME_FORMAT)
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
    return this.client.post<any>(url, {duration, sync}).pipe(
      map(data => Task.create(data))
    );
  }

  retrieveTask(
    taskId: number
  ): Observable<Task> {
    let url: string = `http://localhost:8000/tasks/${taskId}/`;
    return this.client.get<any>(url).pipe(
      map(data => Task.create(data))
    );
  }

  listTasks(): Observable<Task[]> {
    let url: string = 'http://localhost:8000/tasks/';
    return this.client.get<any[]>(url).pipe(
      map(data => {
        return data.map((item: any) => Task.create(item));
      })
    );
  }

  clearTasks(): Observable<any> {
    let url: string = 'http://localhost:8000/tasks/clear/';
    return this.client.post<any>(url, null);
  }
}