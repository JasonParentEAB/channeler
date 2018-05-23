import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { TaskResolver } from './resolvers/task.resolver';
import { TaskService } from './services/task.service';

import { AppComponent } from './components/app/app.component';
import { TasksComponent } from './components/tasks/tasks.component';

import { ROUTES } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken'
    }),
    RouterModule.forRoot(ROUTES, {
      useHash: true
    })
  ],
  providers: [
    TaskService,
    TaskResolver
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
