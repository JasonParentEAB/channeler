import { Routes } from '@angular/router';

import { TaskResolver } from './resolvers/task.resolver';
import { TasksComponent } from './components/tasks/tasks.component';

export const ROUTES: Routes = [
  { 
    path: 'tasks', 
    component: TasksComponent, 
    resolve: {
      tasks: TaskResolver
    }
  },
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  }
];