import { Component, OnDestroy } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { WebSocketSubject } from 'rxjs/webSocket';

import { environment } from '../../../environments/environment';

export class FormData {
  constructor(
    public student: string = ''
  ) {}
}

@Component({
  selector: 'client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnDestroy {
  private socket: WebSocketSubject<any>;
  data: FormData = new FormData();

  constructor(private toastr: ToastrService) {}

  ngOnDestroy(): void {
    this.disconnect();
  }

  connect(): void {
    if (!this.socket || this.socket.closed) {
      this.socket = new WebSocketSubject(`${environment.ws_base_url}/events/`);
      this.socket.subscribe(
        (message) => {
          switch (message.type) {
            case 'send':
              if (message.registration_data == 'SUCCESS') {
                this.toastr.success(`${message.registration_type} succeeded!`);
              }
              else {
                this.toastr.error(`${message.registration_type} failed!`);
              }
              break;
            default:
              this.toastr.info(message.message);
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          console.log('WebSocket connection complete.');
        }
      );
    }
  }

  subscribe(): void {
    this.connect();
    this.socket.next({
      'command': 'subscribe',
      'student': this.data.student
    });
  }

  unsubscribe(): void {
    this.connect();
    this.socket.next({
      'command': 'unsubscribe',
      'student': this.data.student
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.unsubscribe();
    }
  }
}
