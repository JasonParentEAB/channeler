import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { environment } from '../../../environments/environment';

export class FormData {
  constructor(
    public student: string = ''
  ) {}
}

@Component({
  selector: 'server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent {
  data: FormData = new FormData();

  constructor(private http: HttpClient) {}

  sendSuccess(): void {
    this.http.post(`${environment.http_base_url}/events/`, {
      'student': this.data.student,
      'registration_type': 'ADD',
      'registration_data': 'SUCCESS'
    }).subscribe();
  }

  sendFailure(): void {
    this.http.post(`${environment.http_base_url}/events/`, {
      'student': this.data.student,
      'registration_type': 'ADD',
      'registration_data': 'FAILURE'
    }).subscribe();
  }
}
