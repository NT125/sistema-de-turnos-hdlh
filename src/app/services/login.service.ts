import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url: string;

  constructor(private http: HttpClient) {
    this.url = `${baseUrl}/api/login`;
  }

  loginUsuario(formulario: any){
    
    return this.http.post<any>(this.url+'/login', formulario);
  }

  public logout() {
    //borro el vble almacenado mediante el storage
    sessionStorage.removeItem("dni");
    sessionStorage.removeItem("telefono");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("nombre");
  }

  public userLoggedIn() {
    var resultado = false;
    var usuario = sessionStorage.getItem("nombre");
    
    if (usuario != null) {
      resultado = true;
    }
    return resultado;
  }


  public userLogged() {
    var usuario = sessionStorage.getItem("nombre");
    return usuario;
  }
  public rolLogged() {
    var perfil = sessionStorage.getItem("rol");
    return perfil;
  }
 

  public pacienteLogged() {
    var alumnoid = sessionStorage.getItem("id");
    return alumnoid;
  }

  public idLogged() {
    var id = sessionStorage.getItem("id");
    return id;
  }

  getToken(): any {
    if (sessionStorage.getItem("token") != null) {
      return sessionStorage.getItem("token");
    } else {
      return "";
    }
  }
}
