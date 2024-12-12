import { Component, OnInit } from '@angular/core';
import { AdminNavComponent } from "../admin-page/admin-nav/admin-nav.component";
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TurnoService } from '../../services/turno.service';
import { DatePipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { PacienteService } from '../../services/paciente.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Paciente } from '../../models/paciente';
import { WhatsappService } from '../../services/whatsapp.service';
registerLocaleData(localeEs, 'es');
@Component({
  selector: 'app-secretaria-page',
  standalone: true,
  imports: [AdminNavComponent, CommonModule,ReactiveFormsModule, RouterLink],
  providers:[DatePipe,{ provide: LOCALE_ID, useValue: 'es' }],
  templateUrl: './secretaria-page.component.html',
  styleUrl: './secretaria-page.component.css'
})
export class SecretariaPageComponent implements OnInit{ 
  menuTurnoAbierto: boolean;
  selectedTurno: any = null;
  mostrandoFecha: boolean;
  mostrandoSpinner: boolean;

  pacienteActu:Paciente;
  turnoForm:FormGroup
  fecha=new Date();
  ngOnInit(): void {
    this.getTurnos();
    this.fecha = new Date();
    
  }
  constructor(
    private fb:FormBuilder,
    public _turnoService:TurnoService,
    public _pacienteService:PacienteService,
    private datePipe:DatePipe,
    private toastr: ToastrService,
    private router:Router,
    private wppService: WhatsappService
    
  ){
    this.turnoForm = this.fb.group({
      fecha:[''] ,
      busqueda:[''],
      tipo: ['']
    });
    this.pacienteActu= new Paciente(0,"0","0",0);
    this.menuTurnoAbierto = false;
    this.mostrandoFecha = false;
    this.mostrandoSpinner = false;
  }

  diaAnterior(){
    const nuevaFecha = new Date(this.fecha);
    nuevaFecha.setDate(this.fecha.getDate() -1);
    this.fecha = nuevaFecha;
    if (nuevaFecha.getMonth() !== this.fecha.getMonth()) {
      nuevaFecha.setMonth(this.fecha.getMonth() - 1);
    }
    const fechaFormateada = this.datePipe.transform(this.fecha, 'yyyy-MM-dd');
      
      this._turnoService.getTurnosPorFecha(fechaFormateada).subscribe({
        next: (data) => {
          this._turnoService.turnos = data;
        },
        error: (e) => {
          console.log(e);
        },
      });

  }
  diaSiguiente(){
    let nuevaFecha = new Date(this.fecha);
    nuevaFecha.setDate(this.fecha.getDate() +1);
    
   
    this.fecha = nuevaFecha;
    
    const fechaFormateada = this.datePipe.transform(this.fecha, 'yyyy-MM-dd');
      
      this._turnoService.getTurnosPorFecha(fechaFormateada).subscribe({
        next: (data) => {
          this._turnoService.turnos = data;
        },
        error: (e) => {
          console.log(e);
        },
      });
  }
  busqueda() {
    this.mostrandoFecha = true;

    const busquedaValue = this.turnoForm.get('busqueda')?.value;
    const tipoValue = this.turnoForm.get('tipo')?.value;
    
    if (tipoValue === 'medico') {
      // Si el tipo es 'medico', llamamos al servicio de búsqueda por médico
      this._turnoService.getTurnosPorMedico(busquedaValue).subscribe({
        next: (data) => {
          this._turnoService.turnos = data;
        },
        error: (e) => {
          console.log('Error en la búsqueda por médico:', e);
        }
      });
    } else if (tipoValue === 'paciente') {
      // Si el tipo es 'paciente', llamamos al servicio de búsqueda por paciente
      this._turnoService.getTurnosPorPaciente(busquedaValue).subscribe({
        next: (data) => {
          this._turnoService.turnos = data;
        },
        error: (e) => {
          console.log('Error en la búsqueda por paciente:', e);
        }
      });
    }else if (tipoValue === 'obra') {
        // Si el tipo es 'paciente', llamamos al servicio de búsqueda por paciente
        this._turnoService.getTurnosPorObra(busquedaValue).subscribe({
          next: (data) => {
            this._turnoService.turnos = data;
            console.log(data);
          },
          error: (e) => {
            console.log('Error en la búsqueda por paciente:', e);
          }
      });
    } 
    else if (tipoValue === 'consultorio') {
      // Si el tipo es 'paciente', llamamos al servicio de búsqueda por paciente
      this._turnoService.getTurnosPorConsultorio(busquedaValue).subscribe({
        next: (data) => {
          this._turnoService.turnos = data;
          
        },
        error: (e) => {
          console.log('Error en la búsqueda por paciente:', e);
        }
    });
    }else if (tipoValue === 'especialidad') {
      // Si el tipo es 'paciente', llamamos al servicio de búsqueda por paciente
      this._turnoService.getTurnosPorEspecialidad(busquedaValue).subscribe({
        next: (data) => {
          this._turnoService.turnos = data;
          
        },
        error: (e) => {
          console.log('Error en la búsqueda por paciente:', e);
        }
    });
  }
    else {
      console.log('Tipo de búsqueda no reconocido');
    }
  }

  reiniciarFiltros(){
    this.mostrandoFecha = false;
    this.getTurnos();
  }

  buscarFecha(){
    console.log(this.turnoForm.get('fecha')?.value)
    const fechaValue = this.turnoForm.get('fecha')?.value;
    let fechaVal = this.turnoForm.get('fecha')?.value;
    fechaVal=new Date(fechaVal);
    fechaVal.setDate(fechaVal.getDate()+1)
    this.fecha=fechaVal;
    if (fechaValue) {
      
      const fechaFormateada = this.datePipe.transform(fechaValue, 'yyyy-MM-dd');
      console.log(fechaFormateada); 
      this._turnoService.getTurnosPorFecha(fechaFormateada).subscribe({
        next: (data) => {
          this._turnoService.turnos = data;
        },
        error: (e) => {
          console.log(e);
        },
      });
    } else {
      console.log('No se ha seleccionado ninguna fecha');
    }
  }
  
  confirmarDarStrike(turnoS:any,pacienteId: any) {
    const confirmacion = window.confirm('¿Estás seguro de que deseas dar un strike a este usuario?');
    
    if (confirmacion) {
      this.darStrike(turnoS,pacienteId);
    }
  }
  darStrike(turnoS:any,paciente_id:any){
    this._pacienteService.getPaciente(paciente_id).subscribe({
      next:(data) => {
        this.pacienteActu._id=data._id;
        this.pacienteActu.dni=data.dni;
        this.pacienteActu.nombre=data.nombre;
        this.pacienteActu.telefono=data.telefono;
        this.pacienteActu.strikes=data.strikes+1
        console.log(this.pacienteActu.strikes)
        this._pacienteService.putPaciente(this.pacienteActu).subscribe({
          next:(data) => {
            console.log(data);
            
          },
          error:(e) => {
            console.log(e);
          },
          
        })
        
      },
      error:(e) => {
        console.log(e);
      },
      
      
    })
    this.asistio(turnoS);
  }
  confirmarAsistio(turno: any) {
    const confirmacion = window.confirm('¿Estás seguro de finalizar el turno?');
    
    if (confirmacion) {
      this.asistio(turno);
    }
  }
  asistio(turno:any){
    turno.estado="Finalizado"
    this._turnoService.putTurno(turno).subscribe({
      next: (actua) => {
        if (actua.status == '2') {
          this.toastr.success('Turno Finalizado!');
        } else {
          this.toastr.error(actua.msg);
          
        }
      },
      error: (e) => {
        this.toastr.success('Ocurrio un error');
        console.log(e);
      },
    });
  }

  formatearFecha(fechaISO: string) {
    // Convertir la cadena ISO a un objeto Date
    const fecha = new Date(fechaISO);
  
    // Definir las opciones para el formato de la fecha y la hora
    const opcionesFecha: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const opcionesHora: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  
    // Formatear la fecha y la hora
    const formatoFecha = new Intl.DateTimeFormat('es-ES', opcionesFecha).format(fecha);
    const formatoHora = new Intl.DateTimeFormat('es-ES', opcionesHora).format(fecha);
  
    return `${formatoFecha}, ${formatoHora}`.toString();
  }

  confirmarCancelarTurno(turno: any) {
    console.log('Turno', turno);

    
    
    const confirmacion = window.confirm('¿Estás seguro de que deseas cancelar el turno?');
    
    if (confirmacion) {
      const target = turno.paciente_id.telefono;
      const paciente = turno.paciente_id.nombre;
      const fechaHora = this.formatearFecha(turno.fecha);
      const doctor = turno.medico_id.nombre + turno.medico_id.apellido;
      const consultorio = turno.consultorio;
      const especialidad = turno.especialidad_id.nombreEsp;

      this.wppService.sendMessageCancelDate(target, paciente, fechaHora, doctor, consultorio, especialidad);
      this.cancelarTurno(turno);
    }
  }
  cancelarTurno(turno:any){
    turno.estado="Cancelado"
    this._turnoService.putTurno(turno).subscribe({
      next: (actua) => {
        if (actua.status == '2') {
          this.toastr.success('Turno cancelado!');
        } else {
          this.toastr.error(actua.msg);
          
        }
      },
      error: (e) => {
        this.toastr.success('Ocurrio un error');
        console.log(e);
      },
    });
  }
  reprogramarTurno(id:any){
    this.router.navigateByUrl("/secretaria/nuevo-turno/"+id);
  }
  getTurnos() {
    this.mostrandoSpinner = true;
    this.fecha=new Date();
    this._turnoService.getTurnosHoy().subscribe({
      next:(data) => {
        console.log(data);
        this._turnoService.turnos=data;
        this.mostrandoSpinner = false;
      },
      error:(e) => {
        console.log(e);
      },
      
    })
  }

  showMenuTurno(turno: any) {
    this.selectedTurno = turno;
    this.menuTurnoAbierto = true;
  }

  hideMenuTurno() {
    this.selectedTurno = null;
    this.menuTurnoAbierto = false;
  }
}