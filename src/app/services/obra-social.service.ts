import { Injectable } from '@angular/core';
import { ObraSocial } from '../models/obraSocial';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {
  url=`${baseUrl}/api/obra/`;
  
  obras:ObraSocial[];
  obras1:ObraSocial[];
  obras2:ObraSocial[];
  
  constructor(private http: HttpClient) {
    this.obras = [];
    this.obras1 = [];
    this.obras2 = [];
   }
  getObras(){
    return this.http.get<ObraSocial[]>(this.url,this.createHeader());
  }
  getObra(id:any){
    return this.http.get<ObraSocial>(`${this.url}/${id}`,this.createHeader());
  }
  createHeader(){
    return {
      headers: new HttpHeaders({
        'Authorization':sessionStorage.getItem("token")!
      })
    }
  }
 
}
