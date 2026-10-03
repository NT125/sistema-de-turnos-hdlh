import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ObraSocialService } from '../../../services/obra-social.service';
import { ObraSocial } from '../../../models/obraSocial';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-obras-sociales-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './obras-sociales-list.component.html',
  styleUrl: './obras-sociales-list.component.css'
})
export class ObrasSocialesListComponent implements OnInit {
  obrasSociales: ObraSocial[] = [];

  constructor(
    private obraSocialService: ObraSocialService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerObras();
  }

  obtenerObras() {
    this.obraSocialService.getObras().subscribe({
      next: (data: any) => {
        this.obrasSociales = data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  eliminarObra(id: any) {
    if(confirm('¿Estás seguro de eliminar esta Obra Social?')) {
      this.obraSocialService.deleteObra(id).subscribe({
        next: () => {
          this.toastr.success('Obra Social eliminada exitosamente');
          this.obtenerObras();
        },
        error: (err: any) => {
          this.toastr.error('Error al eliminar');
          console.error(err);
        }
      });
    }
  }
}
