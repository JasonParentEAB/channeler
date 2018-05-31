import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ToastrModule } from 'ngx-toastr';

import { TaskResolver } from './resolvers/task.resolver';
import { TaskService } from './services/task.service';

import { AppComponent } from './components/app/app.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ClientComponent } from './components/client/client.component';
import { ServerComponent } from './components/server/server.component';

import { ROUTES } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    ClientComponent,
    ServerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken'
    }),
    RouterModule.forRoot(ROUTES, {
      useHash: true
    }),
    ToastrModule.forRoot()
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
