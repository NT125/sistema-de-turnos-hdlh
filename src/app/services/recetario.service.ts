import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from '../../environments/environment';
import { ComprobanteFarmacia, MedicamentoItem } from '../models/medicamento';
import { MEDICAMENTOS_DATA } from '../data/medicamentos.data';

@Injectable({
  providedIn: 'root'
})
export class RecetarioService {
  private url = `${baseUrl}/api/recetario`;

  constructor(private http: HttpClient) {}

  private createHeader() {
    const token = sessionStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': token
      })
    };
  }

  getMedicamentos(): Observable<MedicamentoItem[]> {
    return this.http.get<MedicamentoItem[]>(`${this.url}/medicamentos`, this.createHeader())
      .pipe(
        catchError((err) => {
          console.warn('No se pudo obtener medicamentos de la API, usando lista local precargada.', err);
          return of(MEDICAMENTOS_DATA);
        })
      );
  }

  getMedicamento(id: string): Observable<MedicamentoItem> {
    return this.http.get<MedicamentoItem>(`${this.url}/medicamentos/${id}`, this.createHeader());
  }

  crearMedicamento(med: Partial<MedicamentoItem>): Observable<any> {
    return this.http.post<any>(`${this.url}/medicamentos`, med, this.createHeader());
  }

  actualizarMedicamento(id: string, med: Partial<MedicamentoItem>): Observable<any> {
    return this.http.put<any>(`${this.url}/medicamentos/${id}`, med, this.createHeader());
  }

  eliminarMedicamento(id: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/medicamentos/${id}`, this.createHeader());
  }

  guardarComprobante(comprobante: ComprobanteFarmacia): Observable<any> {
    return this.http.post<any>(`${this.url}/comprobantes`, comprobante, this.createHeader());
  }

  getComprobantes(busqueda?: string, fecha?: string): Observable<ComprobanteFarmacia[]> {
    let params: string[] = [];
    if (busqueda) params.push(`busqueda=${encodeURIComponent(busqueda)}`);
    if (fecha) params.push(`fecha=${encodeURIComponent(fecha)}`);
    const query = params.length > 0 ? `?${params.join('&')}` : '';

    return this.http.get<ComprobanteFarmacia[]>(`${this.url}/comprobantes${query}`, this.createHeader());
  }

  getComprobante(id: string): Observable<ComprobanteFarmacia> {
    return this.http.get<ComprobanteFarmacia>(`${this.url}/comprobantes/${id}`, this.createHeader());
  }

  buscarPacientePorDni(dni: string | number): Observable<any> {
    const cleanDni = `${dni}`.trim();
    return this.http.get<any>(`${this.url}/paciente/${cleanDni}`, this.createHeader())
      .pipe(
        catchError(() => {
          return this.http.get<any>(`${baseUrl}/api/paciente/termino/${cleanDni}`, this.createHeader());
        })
      );
  }
}
