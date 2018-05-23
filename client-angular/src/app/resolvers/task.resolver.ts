import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Task, TaskService } from '../services/task.service';

@Injectable()
export class TaskResolver implements Resolve<Task[]> {
  constructor(private taskService: TaskService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task[]> {
    return this.taskService.listTasks();
  }
}