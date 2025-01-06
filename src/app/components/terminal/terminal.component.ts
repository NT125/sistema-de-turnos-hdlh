import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ObraSocialService } from '../../services/obra-social.service';
import { ToastrService } from 'ngx-toastr';
import { TurnoService } from '../../services/turno.service';
import { MedicoService } from '../../services/medico.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { TurnoServ } from '../../models/turnoServ';
import { ObraSocial } from '../../models/obraSocial';
import { Router } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');
@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  providers:[DatePipe,  { provide: LOCALE_ID, useValue: 'es' }],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css'
})
export class TerminalComponent implements OnInit{
  turnoForm: FormGroup;
  turno: TurnoServ;
  obra1: boolean = false;
  obra2: boolean = false;
  medico_id: any;
  obra1Array: ObraSocial[]=[];
  obra2Array: ObraSocial[]=[];
  fechaTurno:String = "";
  doctor = ""
  consultorio = ""
  especialidad = ""
   especialidadNombre:String=""
  constructor(
    private fb: FormBuilder,
    public _obraService: ObraSocialService,
    private toastr: ToastrService,
    private route: Router,
    public _turnoService: TurnoService,
    public _medicoService: MedicoService,
    public _especialidadService:EspecialidadService
  ){
    this.turnoForm = this.fb.group({
      pacienteDNI:['',Validators.required],
      pacienteNombre:['',Validators.required],
      especialidad:['',Validators.required],
      obra1: ['',Validators.required],
      obra2: [''],
      obra3: [''],
      turno: ['', Validators.required],
    });
    this.turno = new TurnoServ('0', new Date(), '0', '0', '0', 0);
  }
  ngOnInit(): void {
    this._medicoService.medicos = [];
    this.cargarObras();
    this._medicoService.turnos = [];
    this._obraService.obras = [];
    this._obraService.obras1 = [];
    this._obraService.obras2 = [];
    this.getEspecialidades();
  }
  getEspecialidades() {
    this._especialidadService.getEspecialidades().subscribe({
      next:(data) => {
        this._especialidadService.especialidades=data;
        
      },
      error:(e) => {
        console.log(e);
      },
      
    })
  }
  cargarMedicos(id:any) {
    this._medicoService.getEspecialidades(this.turnoForm.get('especialidad')?.value).subscribe({
      next: (data) => {
        this._medicoService.medicos = data;
        
      },
      error: (e) => {
        this._medicoService.medicos = [];
        this.toastr.error("Sin Medicos")
      },
    });
  }
  cargarTurnos = (id: any) => {
    this.medico_id = id;
    let idEspecialidad = this.turnoForm.get('especialidad')?.value;
    
    this._medicoService
      .getTurnosMedicoEsp(this.medico_id, idEspecialidad)
      .subscribe({
        next: (data) => {
          this._medicoService.turnos = data;
        },
        error: (e) => {
          this._medicoService.turnos = [];
         this.toastr.error("Sin turnos");
        },
      });
  };
  agregarObra() {
    if (this.obra1) {
      this.obra2 = true;
    } else {
      this.obra1 = true;
      
    }
  }
  cargarObras() {
    this._obraService.getObras().subscribe({
      next: (data) => {
        this._obraService.obras = data;
        this._obraService.obras1 = data;
        this._obraService.obras2 = data;
      },
      error: (e) => {
        this._obraService.obras = [];
        console.log(e);
      },
    });
  }
  sacarObra() {
    if (this.obra2) {
      this.obra2 = false;
      this.turnoForm.get('obra3')?.setValue('');
    } else {
      this.obra1 = false;
      
      this.turnoForm.get('obra2')?.setValue('');
      
    }
  }
  
  finalizarTurno() {
    if(this.turnoForm.invalid){
      this.toastr.error("Todos los campos deben estar completos");
      return;
    }
    this._turnoService.getTurno(this.turnoForm.get('turno')?.value).subscribe({
      next: (data) => {
        this.turno = data;

        this.agregarTurno();
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
  
  agregarTurno() {
    if (this.obra1 && this.obra2) {
      this.turno.obras_sociales = [
        this.turnoForm.get('obra1')?.value,
        this.turnoForm.get('obra2')?.value,
        this.turnoForm.get('obra3')?.value,
      ];
    } else if (this.obra1) {
      this.turno.obras_sociales = [
        this.turnoForm.get('obra1')?.value,
        this.turnoForm.get('obra2')?.value,
      ];
    } else {
      this.turno.obras_sociales = [this.turnoForm.get('obra1')?.value];
    }
    if((this.turnoForm.get('obra2')?.value=="" && this.obra1) || (this.turnoForm.get('obra3')?.value=="" && this.obra2)){
      this.toastr.error("Ingrese una Obra correctamente");
      return;
    }
    this.turno.paciente_id = sessionStorage.getItem('id');
    this.turno.nombreTerminal=this.turnoForm.get('pacienteNombre')?.value;
    this.turno.dniTerminal=this.turnoForm.get('pacienteDNI')?.value;
    
    this.turno.estado = 'Ocupado';
    console.log(this.turnoForm)
    this._turnoService.putTurno(this.turno).subscribe({
      next: (actua) => {
        if (actua.status == '2') {
          this.toastr.success('Turno agendado!');
        
          this.pasoActual = 0;
          this._medicoService.getMedico(this.medico_id).subscribe({
            next: (data) => {
              let medico = data;
              medico.disponibles = medico.disponibles - 1;
              console.log(medico);
              this._medicoService.putMedico(data).subscribe({
                next: (data) => {
                  console.log(data);
                },
                error: (e) => {
                  console.log(e);
                },
              });
            },
            error: (e) => {
              console.log(e);
            },
          });
        } else {
          this.toastr.error(actua.msg);
          this.pasoActual = 0;
        }
      },
      error: (e) => {
        this.toastr.success('Ocurrio un error');
        console.log(e);
      },
    });

    
  }
  //MOVILIDAD
  pasoActual: number = 0;

  avanzar = () => {
    let paso4:Boolean=false;
    if (this.pasoActual < 5){
      this.pasoActual++;
      
    }
    
    if(this.pasoActual == 4){
      this._medicoService.turnos = [];
      this.cargarMedicos(this.turnoForm.get('especialidad')?.value);
    }
  }

  retroceder = () => {
    if (this.pasoActual > 0){
      this.pasoActual--;
    }
    console.log("Paso Actual: " + this.pasoActual);
  }

}
