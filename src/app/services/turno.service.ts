import { Injectable } from '@angular/core';
import {Turno} from '../models/turno'
import { HttpClient ,HttpHeaders ,HttpParams} from '@angular/common/http'
import { TurnoServ } from '../models/turnoServ';
import { baseUrl } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  url=`${baseUrl}/api/turno/`;
  
  turnos:any[];
  

  constructor(private http: HttpClient) {
    this.turnos = [];
   }
  getTurnos(){
    return this.http.get<Turno[]>(this.url,this.createHeader());
  }
  getTurnosHoy(){
    return this.http.get<any[]>(this.url+'hoy',this.createHeader());
  }
  getTurnosPorFecha(fecha:any){
    return this.http.get<Turno[]>(this.url+'fecha/'+fecha,this.createHeader());
  }
  getTurnosPorPaciente(busqueda:any){
    return this.http.get<Turno[]>(this.url+'paciente2/'+busqueda,this.createHeader());
  }
  getTurnosPorObra(busqueda:any){
    return this.http.get<Turno[]>(this.url+'obra/'+busqueda,this.createHeader());
  }
  getTurnosPorConsultorio(busqueda:any){
    return this.http.get<Turno[]>(this.url+'consultorio/'+busqueda,this.createHeader());
  }
  getTurnosPorEspecialidad(busqueda:any){
    return this.http.get<Turno[]>(this.url+'especialidad/'+busqueda,this.createHeader());
  }
  

  
  getTurnosPorMedico(busqueda:any){
    return this.http.get<any[]>(this.url+'medico/'+busqueda,this.createHeader());
  }
  postTurno(turno: TurnoServ){
    return this.http.post<any>(this.url, turno,this.createHeader());
  }
  putTurno(turno:TurnoServ){
    return this.http.put<any>(this.url+turno._id,turno,this.createHeader());
  }
  
  getTurno(id:any){
    return this.http.get<TurnoServ>(`${this.url}/${id}`,this.createHeader());
  }
  createHeader(){
    return {
      headers: new HttpHeaders({
        'Authorization':sessionStorage.getItem("token")!
      })
    }
  }
}
