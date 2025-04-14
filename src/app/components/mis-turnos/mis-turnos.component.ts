import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../main-page/nav/nav.component';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { TurnoService } from '../../services/turno.service';
import { TurnoServ } from '../../models/turnoServ';
import { ToastrService } from 'ngx-toastr';
import { MedicoService } from '../../services/medico.service';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

import localeEs from '@angular/common/locales/es';
import { WhatsappService } from '../../services/whatsapp.service';
import { Turno } from '../../models/turno';
registerLocaleData(localeEs, 'es');
@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [NavComponent, CommonModule, RouterLink],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'es' }],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css',
})
export class MisTurnosComponent implements OnInit {
  turnoCancelado: TurnoServ;
  vacio: boolean = false;
  fecha: any;
  infoTurno: any = [];

  ngOnInit(): void {
    this.cargarTurnos();
  }
  constructor(
    public _pacienteService: PacienteService,
    public _turnoService: TurnoService,
    private toastr: ToastrService,
    public _medicoService: MedicoService,
    public _whatsappService: WhatsappService
  ) {
    this.turnoCancelado = new TurnoServ('0', new Date(), '0', '0', '0', 0);
  }

  cargarInfo(turno: Turno) {
    this.infoTurno = turno;
  }

  canCancelTurno(turnoFecha: Date): boolean {
    const turnoDate = new Date(turnoFecha);
    const now = new Date();

    // Resta los tiempos para obtener la diferencia en milisegundos
    const diffInMinutes = (turnoDate.getTime() - now.getTime()) / 1000 / 360;
    console.log(diffInMinutes);
    // Si faltan 60 minutos o menos, devolver false
    return diffInMinutes > 60;
  }
  cargarTurnos() {
    this._pacienteService.getTurnosPaciente().subscribe({
      next: (data) => {
        this._pacienteService.turnos = data;
        console.log(this._pacienteService.turnos);
      },
      error: (e) => {
        this._pacienteService.turnos = [];
        this.vacio = true;
        console.log(e);
      },
    });
  }
  confirmarCancelarTurno(turnoId: any) {
    const confirmacion = window.confirm(
      '¿Estás seguro de que deseas cancelar el turno?'
    );

    if (confirmacion) {
      this.cancelarTurno(turnoId);
    }
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
  
    return `${formatoFecha}, ${formatoHora}`.toString();
  }

  cancelarTurno(idTurno: any) {
    this._turnoService.getTurno(idTurno).subscribe({
      next: (data) => {
        let fecha = this.formatearFecha(data.fecha);
        this._whatsappService
          .cancelarTurno(
            sessionStorage.getItem('telefono')!,
            sessionStorage.getItem('nombre')!,
            fecha,
            data.medico_id.nombre,
            data.consultorio!,
            data.especialidad_id.nombreEsp
          )
          .subscribe((result) => {
            console.log(result);
          });

        this.turnoCancelado.medico_id = data.medico_id;
        this.turnoCancelado.fecha = data.fecha;
        this.turnoCancelado.consultorio = data.consultorio;
        this.turnoCancelado.duracion = data.duracion;
        this.turnoCancelado.especialidad_id = data.especialidad_id;
        this.turnoCancelado._id = data._id;
        this.turnoCancelado.paciente_id = null;
        this.turnoCancelado.obras_sociales = [];
        this.dejarLibreTurno();
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  dejarLibreTurno() {
    this.turnoCancelado.estado = 'Disponible';
    this._turnoService.putTurno(this.turnoCancelado).subscribe({
      next: (actua) => {
        if (actua.status == '2') {
          this.toastr.success('Turno cancelado!');
          this.cargarTurnos();
        } else {
          this.toastr.error('Error');
          console.log(actua);
        }
      },
      error: (e) => {
        this.toastr.error('Ocurrio un error');
        console.log(e);
      },
    });

    this._medicoService.getMedico(this.turnoCancelado.medico_id).subscribe({
      next: (data) => {
        let medico = data;
        medico.disponibles = medico.disponibles + 1;
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
}
