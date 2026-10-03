import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EspecialidadService } from '../../../services/especialidad.service';
import { Especialidad } from '../../../models/especialidad';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-especialidades-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './especialidades-form.component.html',
  styleUrl: './especialidades-form.component.css'
})
export class EspecialidadesFormComponent implements OnInit {
  especialidadForm: FormGroup;
  titulo = 'Crear Especialidad';
  id: string | null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute,
    private especialidadService: EspecialidadService
  ) {
    this.especialidadForm = this.fb.group({
      nombreEsp: ['', Validators.required],
      activa: [true]
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  agregarEspecialidad() {
    const especialidad: Especialidad = {
      nombreEsp: this.especialidadForm.get('nombreEsp')?.value,
      activa: this.especialidadForm.get('activa')?.value
    };

    if (this.id !== null) {
      // Editar
      this.especialidadService.putEspecialidad(this.id, especialidad).subscribe({
        next: () => {
          this.toastr.info('Especialidad actualizada exitosamente');
          this.router.navigate(['/admin/especialidades']);
        },
        error: (err: any) => {
          console.error(err);
          this.toastr.error('Error al actualizar');
        }
      });
    } else {
      // Agregar
      this.especialidadService.postEspecialidad(especialidad).subscribe({
        next: () => {
          this.toastr.success('Especialidad registrada exitosamente');
          this.router.navigate(['/admin/especialidades']);
        },
        error: (err: any) => {
          console.error(err);
          this.toastr.error('Error al registrar');
        }
      });
    }
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Especialidad';
      this.especialidadService.getEspecialidad(this.id).subscribe({
        next: (data: any) => {
          this.especialidadForm.setValue({
            nombreEsp: data.nombreEsp,
            activa: data.activa !== false
          });
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }
}
