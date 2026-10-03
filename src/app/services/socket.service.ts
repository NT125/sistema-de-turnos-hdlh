import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { baseUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor() {
    this.socket = io(baseUrl);
  }

  // Evento para recibir el código QR
  onQRCode(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('qr', (data: string) => {
        observer.next(data);
      });
    });
  }

  // Evento para verificar si ya se leyó el QR
  onQRRead(): Observable<boolean> {
    return new Observable((observer) => {
      this.socket.on('qr-read', () => {
        observer.next(true);
      });
    });
  }

  // Evento para verificar si el cliente ya está listo
  onClientReady(): Observable<boolean> {
    return new Observable((observer) => {
      this.socket.on('ready', () => {
        observer.next(true);
      });
    });
  }
  
}
