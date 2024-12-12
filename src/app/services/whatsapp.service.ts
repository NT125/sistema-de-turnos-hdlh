import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WhatsappService {
  private urlBase = `${baseUrl}/api/whatsapp`;
  constructor(private _http: HttpClient) {}

  sendInfoTurno(
    target: String,
    paciente: String,
    fechaHora: String,
    doctor: String,
    consultorio: String,
    especialidad: String
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      target,
      paciente,
      fechaHora,
      doctor,
      consultorio,
      especialidad,
    };
    return this._http.post(`${this.urlBase}/info-turno`, body, { headers });
  }

  cancelarTurno(
    target: String,
    paciente: String,
    fechaHora: String,
    doctor: String,
    consultorio: String,
    especialidad: String
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      target,
      paciente,
      fechaHora,
      doctor,
      consultorio,
      especialidad,
    };
    return this._http.post(`${this.urlBase}/cancelado`, body, { headers });
  }

  resetPassword(target: String, link: String): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      target,
      link,
    };
    return this._http.post(`${this.urlBase}/recover-password`, body, {
      headers,
    });
  }

  sendMessageCancelDate(
    target: String,
    paciente: String,
    fechaHora: String,
    doctor: String,
    consultorio: String,
    especialidad: String
  ) {}
}
