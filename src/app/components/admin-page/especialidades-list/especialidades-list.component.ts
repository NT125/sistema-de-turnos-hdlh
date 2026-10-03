import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EspecialidadService } from '../../../services/especialidad.service';
import { Especialidad } from '../../../models/especialidad';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-especialidades-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './especialidades-list.component.html',
  styleUrl: './especialidades-list.component.css'
})
export class EspecialidadesListComponent implements OnInit {
  especialidades: Especialidad[] = [];

  constructor(
    private especialidadService: EspecialidadService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerEspecialidades();
  }

  obtenerEspecialidades() {
    this.especialidadService.getEspecialidades().subscribe({
      next: (data: any) => {
        this.especialidades = data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  eliminarEspecialidad(id: any) {
    if(confirm('¿Estás seguro de eliminar esta Especialidad?')) {
      this.especialidadService.deleteEspecialidad(id).subscribe({
        next: () => {
          this.toastr.success('Especialidad eliminada exitosamente');
          this.obtenerEspecialidades();
        },
        error: (err: any) => {
          this.toastr.error('Error al eliminar');
          console.error(err);
        }
      });
    }
  }
}
