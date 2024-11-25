import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import {Paciente} from '../../models/paciente'
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule,CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit{
  //Variables condicionales.
  pacienteForm:FormGroup;
  passwordMismatch: boolean = false;
  dniInvalid: boolean = false;
  passwd: boolean = false;
  accion:String= "";
  idUser:any;
  //Inicio
  constructor(private fb:FormBuilder, public _pacienteService: PacienteService,
    private toastr: ToastrService,private router:Router,public _loginService:LoginService,
  private activatedRouter:ActivatedRoute){
    this.pacienteForm = this.fb.group({
      dni: ['',
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.pattern('^[0-9]+$')
        ],
       
      ],
      nombre: ['',Validators.required],
      telefono: ['',Validators.required,Validators.pattern('^[10-15]+$')],
      uemail: ['',Validators.required],
      codArea: ['',Validators.required],
      passw1: ['',Validators.required],
      passw2: ['',Validators.required],
      rol:['']
      
    });

    // Monitorear cambios en tiempo real
    this.pacienteForm.get('passw2')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });

    this.pacienteForm.get('passw1')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });
    this.pacienteForm.get('dni')?.valueChanges.subscribe(() => {  
      this.checkDni();
    });
  }
  ngOnInit(): void {
    this.activatedRouter.params.subscribe(
      params=>{
          if(params['id']==null){
            this.accion='agregar'
            
          }else{
            this.accion="editar";  
            this.idUser=params['id']; 
            this.obtenerUsuario();
          }
      }
    )
  }
  obtenerUsuario(){
    this._pacienteService.getPaciente(this.idUser).subscribe({
      next:(data) => {
        this.pacienteForm = this.fb.group({
          dni: [
              data.dni,
            [ 
              Validators.required,
              Validators.maxLength(8),
              Validators.pattern('^[0-9]+$')
            ],
           
          ],
          nombre: [data.nombre,Validators.required],
          telefono: [data.telefono,Validators.required],
          uemail: [data.email,Validators.required],
          passw1: ['',Validators.required],
          codArea:[''],
          passw2: ['',Validators.required],
          rol:[data.rol,Validators.required]
        })
        this.pacienteForm.get('passw2')?.valueChanges.subscribe(() => {
          this.checkPasswords();
        });
    
        this.pacienteForm.get('passw1')?.valueChanges.subscribe(() => {
          this.checkPasswords();
        });
        this.pacienteForm.get('dni')?.valueChanges.subscribe(() => {  
          this.checkDni();
        });
      },
      error:(e) => {
        console.log(e);
      },
  })
}
  checkPasswords(): void {
    const passw1 = this.pacienteForm.get('passw1')?.value;
    const passw2 = this.pacienteForm.get('passw2')?.value;

    this.passwordMismatch = passw1 !== passw2;  // Actualiza passwordMismatch
  }
  checkDni(): void {
    const dniControl = this.pacienteForm.get('dni')?.value;
    this.dniInvalid = dniControl?.invalid && dniControl?.touched;
  }
  showHidePwd(){
    this.passwd = !this.passwd;
    
  }
  editarUsuario(){
    if (this.passwordMismatch) {
      this.toastr.error("Las contraseñas no coinciden.");
      return;
    }
    if (this.pacienteForm.invalid) {
      this.toastr.error("Todos los campos deben estar completos y correctos.");
      return;
    }
    console.log(this.pacienteForm.get('telefono'))
    const PACIENTE: Paciente ={
      _id:this.idUser,
      dni: Number(this.pacienteForm.get('dni')?.value),
      nombre: this.pacienteForm.get('nombre')?.value,
      telefono:this.pacienteForm.get('codArea')?.value+this.pacienteForm.get('telefono')?.value,
      passw: this.pacienteForm.get('passw1')?.value,
      email:this.pacienteForm.get('uemail')?.value,
      strikes:0
    }
    if(this.pacienteForm.get('rol')?.value){
      PACIENTE.rol=this.pacienteForm.get('rol')?.value;
    }
    this._pacienteService.putPaciente(PACIENTE).subscribe({
      next:(data) => {
       if(data.status=='1'){
        this.toastr.success("Usuario Actualizado!");
        this.router.navigateByUrl('usuario-list')
      
       }
        
      },
      error:(e) => {
        console.log(e);
      },
      
    })
  }
  agregarPaciente(){
    if (this.passwordMismatch) {
      this.toastr.error("Las contraseñas no coinciden.");
      return;
    }
    if (this.pacienteForm.invalid) {
      this.toastr.error("Todos los campos deben estar completos y correctos.");
      return;
    }
    const PACIENTE: Paciente ={
      dni: Number(this.pacienteForm.get('dni')?.value),
      nombre: this.pacienteForm.get('nombre')?.value,
      telefono:this.pacienteForm.get('codArea')?.value + this.pacienteForm.get('telefono')?.value,
      passw: this.pacienteForm.get('passw1')?.value,
      email:this.pacienteForm.get('uemail')?.value,
      strikes:0
    }
    if(this.pacienteForm.get('rol')?.value){
      PACIENTE.rol=this.pacienteForm.get('rol')?.value;
    }
    
    this._pacienteService.postPaciente(PACIENTE).subscribe({
      next:(data) => {
        if(data.status=='1'){
          this.toastr.success("Cuenta creada con éxito.")
          if(this._loginService.rolLogged()=='admin')
          {
            
          this.router.navigateByUrl('/admin');
          }else{
            this.router.navigateByUrl('/login');
       
          }
        }
        
        if(data.status=='2'){
          this.toastr.error("El DNI ya está registrado.")
        }
        
        if(data.status=='0'){
          this.toastr.error(data.msg)
        }
        if(data.status=='3'){
          this.toastr.error("El telefono ya está registrado.")
        }
        
      },
      error:(e) => {
        this.toastr.success(e);
      },
      
    })

  }

}
