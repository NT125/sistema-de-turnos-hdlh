import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medico } from '../models/medico';
import { Turno } from '../models/turno';
import { baseUrl } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  url=`${baseUrl}/api/medico/`;
  
  medicos:any[];
  turnos:Turno[];
  constructor(private http: HttpClient) {
    this.medicos = [];
    this.turnos=[];
   }
  getMedicos(){

    return this.http.get<Medico[]>(this.url,this.createHeader());
  }
  getMedico(id:any){
    return this.http.get<Medico>(`${this.url}/${id}`,this.createHeader());
  }

  getEspecialidades(id:any){
    return this.http.get<any>(`${this.url}especialidad/${id}`,this.createHeader());
  }
  postMedico(medico: Medico){
    return this.http.post<any>(this.url,medico,this.createHeader());
  }
  putMedico(medico: Medico){
    return this.http.put<any>(this.url+medico._id, medico,this.createHeader());
  }
  deleteMedico(id:any){
    return this.http.delete<any>(`${this.url}/${id}`,this.createHeader());
  }
  getTurnosMedico(id:any){
    return this.http.get<Turno[]>(`${this.url}turnos/${id}`);
  }
  getTurnosMedicoEsp(idMedico:any,idEspecialidad:any){
    return this.http.get<Turno[]>(`${this.url}turnosdisp/${idMedico}/especialidad/${idEspecialidad}`,this.createHeader());
  }
  getMedicosTermino(termino:any){
    return this.http.get<Medico[]>(`${this.url}busqueda/${termino}`,this.createHeader());
  }
  createHeader(){
    return {
      headers: new HttpHeaders({
        'Authorization':sessionStorage.getItem("token")!
      })
    }
  }
}
