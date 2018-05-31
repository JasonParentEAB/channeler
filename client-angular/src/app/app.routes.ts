import { Routes } from '@angular/router';

import { TaskResolver } from './resolvers/task.resolver';
import { TasksComponent } from './components/tasks/tasks.component';
import { ClientComponent } from './components/client/client.component';
import { ServerComponent } from './components/server/server.component';

export const ROUTES: Routes = [
  { 
    path: 'tasks', 
    component: TasksComponent, 
    resolve: {
      tasks: TaskResolver
    }
  },
  {
    path: 'client',
    component: ClientComponent
  },
  {
    path: 'server',
    component: ServerComponent
  },
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  }
];