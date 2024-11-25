import { Injectable } from '@angular/core'
import {Paciente} from '../models/paciente'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Turno } from '../models/turno';
import { baseUrl } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  url=`${baseUrl}/api/paciente/`;
  
  pacientes:Paciente[];
  turnos:Turno[];

  constructor(private http: HttpClient) {
    this.pacientes = [];
    this.turnos=[];
   }
  getPacientes(){
    return this.http.get<Paciente[]>(this.url,this.createHeader());
  }
  getUsuarios(){
    return this.http.get<Paciente[]>(this.url+"/usuarios",this.createHeader());
  }
  getSoloPacientes(){
    return this.http.get<Paciente[]>(this.url+"/pacientes",this.createHeader());
  }
  getPacientesStrikes(){
    return this.http.get<Paciente[]>(this.url+"/ban",this.createHeader());
  }
  getPaciente(id:any){
    return this.http.get<Paciente>(`${this.url}/${id}`,this.createHeader());
  }
  getPacientesTermino(termino:any){
    return this.http.get<Paciente[]>(`${this.url}/termino/${termino}`,this.createHeader());
  }
  getPacientesTerminoSec(termino:any){
    return this.http.get<Paciente[]>(`${this.url}/terminoSec/${termino}`,this.createHeader());
  }
  postPaciente(paciente: Paciente){
    return this.http.post<any>(this.url+'/register', paciente);
  }
  loginUsuario(formulario: any){
    return this.http.post<any>(this.url+'/login', formulario,this.createHeader());
  }
  deletePaciente(id:any){
    return this.http.delete<any>(`${this.url}/${id}`,this.createHeader());
  }
  putPaciente(paciente: Paciente){
    return this.http.put<any>(this.url+paciente._id, paciente,this.createHeader());
  }
  getTurnosPaciente(){
    return this.http.get<Turno[]>(`${this.url}/turnos/${sessionStorage.getItem('id')}`,this.createHeader());
  }

  requestPasswordReset(datos:any){
    return this.http.post<any>(`${this.url}/request-password-reset`, datos);
  }

  resetPassword(token: string, newPassword:string){
    return this.http.post<any>(`${this.url}/reset-password`, {token, newPassword})
  }
  resetPasswordSinToken(cPassword: string, newPassword:string, idPac:any){
    return this.http.post<any>(`${this.url}reset-sintoken`, {cPassword, newPassword,idPac},this.createHeader())
  }
  createHeader(){
    return {
      headers: new HttpHeaders({
        'Authorization':sessionStorage.getItem("token")!
      })
    }
  }
}
