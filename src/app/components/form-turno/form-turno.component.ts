import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { NavComponent } from '../main-page/nav/nav.component';
import { CommonModule } from '@angular/common';
import { MedicoService } from '../../services/medico.service';

import { ObraSocialService } from '../../services/obra-social.service';
import { TurnoService } from '../../services/turno.service';
import {
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { TurnoServ } from '../../models/turnoServ';
import { Turno } from '../../models/turno';
import { ToastrService } from 'ngx-toastr';
import { WhatsappService } from '../../services/whatsapp.service';
import { DatePipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ObraSocial } from '../../models/obraSocial';
import { EspecialidadService } from '../../services/especialidad.service';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-form-turno',
  standalone: true,
  imports: [RouterLink, NavComponent, ReactiveFormsModule, CommonModule],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'es' }],
  templateUrl: './form-turno.component.html',
  styleUrl: './form-turno.component.css',
})
export class FormTurnoComponent implements OnInit {
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
  turnosdisponible=""
   especialidadNombre:String=""

  ngOnInit(): void {
    this._medicoService.medicos = [];
    this.cargarObras();
    this._medicoService.turnos = [];
    this._obraService.obras = [];
    this._obraService.obras1 = [];
    this._obraService.obras2 = [];
    this.activatedRoute.params.subscribe((params) => {
      this.cargarMedicos(params['id']);
      this.obtenerEspecialidad(params['id']);
    });
  
  }
  constructor(
    private fb: FormBuilder,
    public _obraService: ObraSocialService,
    private toastr: ToastrService,
    public _turnoService: TurnoService,
    public _medicoService: MedicoService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public _whatsappService: WhatsappService,
    public _especialidadService:EspecialidadService
  ) {
    this.turnoForm = this.fb.group({
      obra1: [''],
      obra2: [''],
      obra3: [''],
      turno: ['', Validators.required],
    });
    this.turno = new TurnoServ('0', new Date(), '0', '0', '0', 0);
  }
  obtenerEspecialidad(id:any){
    this._especialidadService.getEspecialidad(id).subscribe({
      next: (data) => {
        this.especialidadNombre= data.nombreEsp;
        
      },
      error: (e) => {
        this._medicoService.medicos = [];
        this.toastr.error("Sin Medicos")
      },
    });
  }
  
  cargarMedicos(id: any) {
    this._medicoService.getEspecialidades(id).subscribe({
      next: (data) => {
        console.log(data);
        this._medicoService.medicos = data;
        
      },
      error: (e) => {
        this._medicoService.medicos = [];
        this.toastr.error("Sin Medicos")
      },
    });
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
  
  cargarTurnos = (id: any) => {
    this.medico_id = id;
    let idEspecialidad = '';
    this.activatedRoute.params.subscribe((params) => {
      idEspecialidad = params['id'];
    });

    this._medicoService
      .getTurnosMedicoEsp(this.medico_id, idEspecialidad)
      .subscribe({
        next: (data) => {
          console.log(data);
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

  sacarObra() {
    if (this.obra2) {
      this.obra2 = false;
      this.turnoForm.get('obra3')?.setValue('');
    } else {
      this.obra1 = false;
      
      this.turnoForm.get('obra2')?.setValue('');
      
    }
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
    this.turno.estado = 'Ocupado';
    this._turnoService.putTurno(this.turno).subscribe({
      next: (actua) => {
        if (actua.status == '2') {
          this.toastr.success('Turno agendado!');
          this._whatsappService
            .sendInfoTurno(
              sessionStorage.getItem('telefono')!,
              sessionStorage.getItem('nombre')!,
              this.fechaTurno.toString(),
              this.doctor,
              this.consultorio,
              this.especialidad
            )
            .subscribe({
              next: (data) => {
                console.log(data);
              },
              error: (e) => {
                console.log(e);
              },
            });

          this.route.navigateByUrl('/');
        } else {
          this.toastr.error(actua.msg);
          this.route.navigateByUrl('/');
        }
      },
      error: (e) => {
        this.toastr.success('Ocurrio un error');
        console.log(e);
      },
    });

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
  }

  finalizarTurno() {
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
  formatearFecha(fechaISO: any) {
    // Convertir la cadena ISO a un objeto Date
    
    const fecha = new Date(fechaISO);
  
    // Definir las opciones para el formato de la fecha y la hora
    const opcionesFecha: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const opcionesHora: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  
    // Formatear la fecha y la hora
    const formatoFecha = new Intl.DateTimeFormat('es-ES', opcionesFecha).format(fecha);
    const formatoHora = new Intl.DateTimeFormat('es-ES', opcionesHora).format(fecha);
  
    this.fechaTurno = `${formatoFecha}, ${formatoHora}`.toString();
  }
  
  getConsultorio(consultorio:any){
   
    this.consultorio = consultorio;
  }

  getDoctor(apellido:string, nombre: string){
    this.doctor = `${apellido} ${nombre}`
  }

  getEspecialidad(esp:any){
    
    this.especialidad = esp
  }
  
}
