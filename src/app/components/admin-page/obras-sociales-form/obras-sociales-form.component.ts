import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ObraSocialService } from '../../../services/obra-social.service';
import { ToastrService } from 'ngx-toastr';
import { ObraSocial } from '../../../models/obraSocial';

@Component({
  selector: 'app-obras-sociales-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './obras-sociales-form.component.html',
  styleUrl: './obras-sociales-form.component.css'
})
export class ObrasSocialesFormComponent implements OnInit {
  obraForm: FormGroup;
  titulo = 'Crear Obra Social';
  id: string | null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private aRouter: ActivatedRoute,
    private obraSocialService: ObraSocialService,
    private toastr: ToastrService
  ) {
    this.obraForm = this.fb.group({
      nombreOS: ['', Validators.required]
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  agregarObra() {
    const obra: ObraSocial = {
      nombreOS: this.obraForm.get('nombreOS')?.value
    };

    if (this.id !== null) {
      // Edit
      this.obraSocialService.putObra(this.id, obra).subscribe({
        next: () => {
          this.toastr.info('La obra social fue actualizada', 'Obra Social Actualizada');
          this.router.navigate(['/admin/obras-sociales']);
        },
        error: (err: any) => {
          console.error(err);
          this.obraForm.reset();
        }
      });
    } else {
      // Create
      this.obraSocialService.postObra(obra).subscribe({
        next: () => {
          this.toastr.success('La obra social fue registrada', 'Obra Social Registrada');
          this.router.navigate(['/admin/obras-sociales']);
        },
        error: (err: any) => {
          console.error(err);
          this.obraForm.reset();
        }
      });
    }
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Obra Social';
      this.obraSocialService.getObraId(this.id).subscribe((data: any) => {
        this.obraForm.setValue({
          nombreOS: data.nombreOS
        });
      });
    }
  }
}
