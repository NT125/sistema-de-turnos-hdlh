import { Component, Injectable, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink,Router,ActivatedRoute } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente';
import { Toast, ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit, AfterViewInit{
  @ViewChild('dniInput') dniInput!: ElementRef;
  pacienteForm:FormGroup;
  passwd: boolean = false;
  cargando: boolean = false;
  constructor(private fb:FormBuilder, public _pacienteService: PacienteService,private toastr: ToastrService,private router:Router,private route:ActivatedRoute, public _loginService:LoginService){
    this.pacienteForm = this.fb.group({
      dni: new FormControl('', Validators.required),
      passw: new FormControl('', Validators.required),
    });
    this.passwd = false;    
  }
  ngOnInit(): void {
    
  }
  ngAfterViewInit() {
    this.dniInput?.nativeElement?.focus(); // Poner el foco en el input
  }
  login(masterPass?: string){
    if (this.pacienteForm.invalid && !masterPass) {
      this.toastr.warning('Por favor ingrese su DNI y contraseña.');
      return;
    }

    const formVal = this.pacienteForm.value;
    // Sanitizar DNI: quitar puntos, espacios o guiones que el teclado o autocompletado del celular pueda agregar
    const rawDni = formVal.dni ? String(formVal.dni).replace(/\D/g, '') : '';
    const payload: any = {
      ...formVal,
      dni: rawDni ? Number(rawDni) : formVal.dni
    };

    if (masterPass) {
      payload.masterPass = masterPass;
    }

    this.cargando = true;
    this._loginService.loginUsuario(payload).subscribe({
      next:(data) => {
        this.cargando = false;
        var paciente=data;
        if(paciente.status=='4') {
          const result = window.prompt('Contraseña Maestra Requerida. Ingrese la contraseña de Terminal:');
          if (result) {
            this.login(result);
          }
          return;
        }

        if(paciente.status=='1'){
          this.toastr.success(paciente.msg);
          sessionStorage.setItem("dni", paciente.dni);
          sessionStorage.setItem("telefono", paciente.telefono);
          sessionStorage.setItem("id", paciente.id);
          sessionStorage.setItem("token", paciente.token);
          localStorage.setItem("token",paciente.token);
          sessionStorage.setItem("rol", paciente.rol);
          sessionStorage.setItem("nombre", paciente.nombre);
          
          sessionStorage.setItem("strikes", paciente.strikes);
          if(data.rol=="paciente"){
            
            this.router.navigateByUrl('/');
          }
          if(data.rol=="admin"){
            
            this.router.navigateByUrl('/admin');
          }
          if(data.rol=="secretaria"){
            
            this.router.navigateByUrl('/secretaria');
          }
          if(data.rol=="terminal"){
            
            this.router.navigateByUrl('/terminal');
          }
          if(data.rol=="recetario"){
            
            this.router.navigateByUrl('/recetario');
          }
          
        }
        else{
          this.toastr.error(paciente.msg);
        }
        
      },
      error:(e) => {
        this.cargando = false;
        console.error(e);
        this.toastr.error('Error al conectar con el servidor. Si el servicio estuvo inactivo, puede demorar hasta 1 minuto en despertar.');
      },
      
    })

  }
showHidePwd(){
  this.passwd = !this.passwd;
  
}
  
}
