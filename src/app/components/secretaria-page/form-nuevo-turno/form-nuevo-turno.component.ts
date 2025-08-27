import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminNavComponent } from "../../admin-page/admin-nav/admin-nav.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EspecialidadService } from '../../../services/especialidad.service';
import { CommonModule } from '@angular/common';
import { MedicoService } from '../../../services/medico.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { Turno } from '../../../models/turno';
import { Paciente } from '../../../models/paciente';
import { ObraSocial } from '../../../models/obraSocial';
import { TurnoService } from '../../../services/turno.service';
import { TurnoServ } from '../../../models/turnoServ';
import { Toast, ToastrService } from 'ngx-toastr';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-form-nuevo-turno',
  standalone: true,
  imports: [AdminNavComponent, RouterLink, CommonModule, ReactiveFormsModule],
  
  templateUrl: './form-nuevo-turno.component.html',
  styleUrl: './form-nuevo-turno.component.css'
})
export class FormNuevoTurnoComponent implements OnInit , OnDestroy {
  turnoForm: FormGroup;
  fechaMin: string='';
  subscription?: Subscription;
  accion:String=""
  idTurno:any
  ngOnInit(): void {
    this.getEspecialidades();
    this.activatedRouter.params.subscribe(
      params=>{
          if(params['id']==null){
            this.accion='agregar'
            
          }else{
            this.accion="editar";  
            this.idTurno=params['id']; 
            this.getTurno();
          }
      }
    )
    this._especialidadService.especialidades = [];
    this._medicoService.medicos = [];
    this.updateFechaMin();
    // Actualizar la fecha mínima cada minuto (opcional)
    this.subscription = interval(60000).subscribe(() => this.updateFechaMin());
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  formatDate(fechaISO: any): string {
    const fecha = new Date(fechaISO);
    const year = fecha.getFullYear();
    const month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const day = ('0' + fecha.getDate()).slice(-2);
    const hours = ('0' + fecha.getHours()).slice(-2);
    const minutes = ('0' + fecha.getMinutes()).slice(-2);
  
  // Retorna la fecha en el formato adecuado para un campo 'datetime-local'
  return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  getTurno() {
    this._turnoService.getTurno(this.idTurno).subscribe({
      next:(data) => {
        console.log(data.especialidad_id)
        const fechaFormateada = this.formatDate(data.fecha);

        this.turnoForm = this.fb.group({
          especialidad: [data.especialidad_id._id, Validators.required],
          medico: [data.medico_id._id, Validators.required],
          fecha: [fechaFormateada,Validators.required],
          duracion: [data.duracion, Validators.required],
          consultorio: [data.consultorio, Validators.required],
          estado:[data.estado]
        })
        
        this.preCargarMedicos(data.especialidad_id._id);
      },
      error:(e) => {
        console.log(e);
      },
  })
  }
  updateFechaMin(): void {
    const now = new Date();
    this.fechaMin = now.toISOString().slice(0, 16);
  }
  constructor(
    private fb: FormBuilder,
    public _especialidadService: EspecialidadService,
    public _medicoService: MedicoService,
    public _turnoService: TurnoService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRouter:ActivatedRoute
  ) {

    this.turnoForm = this.fb.group({
      especialidad: ['', Validators.required],
      medico: ['', Validators.required],
      fecha: ['', Validators.required],
      duracion: ['', Validators.required],
      consultorio: ['', Validators.required],
      estado:[''],
      cantidad:[1]
    })
  }
  
  editarTurno() {
    if (this.turnoForm.invalid) {
      this.toastr.error("Todos los campos deben estar completos");
      return;
    }
    const fechaRaw = this.turnoForm.get('fecha')?.value;
    const fechaISO = new Date(fechaRaw).toISOString();
    const TURNO: TurnoServ = {
      _id:this.idTurno,
      medico_id: this.turnoForm.get('medico')?.value,
      especialidad_id: this.turnoForm.get('especialidad')?.value,
      fecha: new Date(fechaISO),
      duracion: this.turnoForm.get('duracion')?.value,
      consultorio: this.turnoForm.get('consultorio')?.value,
      estado: this.turnoForm.get('estado')?.value

    }
    this._turnoService.putTurnoSecretaria(TURNO).subscribe({
      next: (data) => {

        this.toastr.success(data.msg);
        
        

        
        this.router.navigateByUrl('secretaria');

      },
      error: (e) => {
        console.log(e);
      },

    })

  }
  
    agregarTurno() {
      if (this.turnoForm.invalid) {
        this.toastr.error("Todos los campos deben estar completos");
        return;
      }
    
      const fechaRaw = this.turnoForm.get('fecha')?.value;
      let fechaInicial = new Date(fechaRaw);
      const duracion = this.turnoForm.get('duracion')?.value;
      const cantidad = this.turnoForm.get('cantidad')?.value; // Aquí defines la cantidad de turnos que quieres crear
    
      for (let i = 0; i < cantidad; i++) {
        const fechaTurno = new Date(fechaInicial); // Copia la fecha inicial
        const TURNO: TurnoServ = {
          medico_id: this.turnoForm.get('medico')?.value,
          especialidad_id: this.turnoForm.get('especialidad')?.value,
          fecha: fechaTurno,
          duracion: duracion,
          consultorio: this.turnoForm.get('consultorio')?.value,
          estado: "Disponible"
        };
    
        this._turnoService.postTurno(TURNO).subscribe({
          next: (data) => {
            this.toastr.success(`Turno ${i + 1} creado con éxito: ${data.msg}`);       
          },
          error: (e) => {
            console.log(e);
          },
        });
      
        // Incrementar la fecha para el siguiente turno
        fechaInicial.setMinutes(fechaInicial.getMinutes() + duracion);
      }
      this._medicoService.getMedico(this.turnoForm.get('medico')?.value).subscribe({
        next: (data) => {
          let medico = data
          medico.disponibles = medico.disponibles + cantidad;
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
      this.router.navigateByUrl('secretaria');
    }
 
  getEspecialidades() {
    this._especialidadService.getEspecialidades().subscribe({
      next: (data) => {
        this._especialidadService.especialidades = data;

      },
      error: (e) => {
        console.log(e);
      },

    })
  }
  getEspMedico(id: any) {
    this._medicoService.getEspecialidades(id).subscribe({
      next: (data) => {
        console.log(data);

      },
      error: (e) => {
        console.log(e);
      },

    })
  }

  cargarMedicos = (event: any) => {

    this._medicoService.medicos = [];
    const idEspecialidad = event.target.value;
    this._medicoService.getEspecialidades(idEspecialidad).subscribe({
      next: (data) => {
        this._medicoService.medicos = data;
      },
      error: (e) => {
        this._medicoService.medicos = [];
        console.log(e);
      },

    })
  }
  preCargarMedicos = (id: any) => {

    this._medicoService.medicos = [];
    const idEspecialidad = id;
    this._medicoService.getEspecialidades(idEspecialidad).subscribe({
      next: (data) => {
        this._medicoService.medicos = data;
      },
      error: (e) => {
        this._medicoService.medicos = [];
        console.log(e);
      },

    })
  }

}
