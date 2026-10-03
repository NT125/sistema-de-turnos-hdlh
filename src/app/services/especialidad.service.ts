import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Especialidad} from '../models/especialidad';
import { baseUrl } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  
  url=`${baseUrl}/api/especialidad/`;
  
  especialidades:Especialidad[];
  

  constructor(private http: HttpClient) {
    this.especialidades = [];
   }
  getEspecialidades(){
    return this.http.get<Especialidad[]>(this.url,this.createHeader());
  }
  getEspecialidadesMedico(){
    return this.http.get<Especialidad[]>(`${this.url}/medico`,this.createHeader());
  }
  getEspecialidad(id:any){
    return this.http.get<Especialidad>(`${this.url}/${id}`,this.createHeader());
  }
  
  postEspecialidad(especialidad: Especialidad): Observable<any>{
    return this.http.post(this.url, especialidad, this.createHeader());
  }

  putEspecialidad(id: string, especialidad: Especialidad): Observable<any>{
    return this.http.put(`${this.url}/${id}`, especialidad, this.createHeader());
  }

  deleteEspecialidad(id: string): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, this.createHeader());
  }

  createHeader(){
    return {
      headers: new HttpHeaders({
        'Authorization':sessionStorage.getItem("token")!
      })
    }
  }
}


