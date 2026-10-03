import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from '../../../services/paciente.service';
import { ToastrService } from 'ngx-toastr';
import { NavComponent } from '../nav/nav.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavComponent, RouterModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit {
  perfilForm: FormGroup;
  pacienteId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private toastr: ToastrService
  ) {
    this.perfilForm = this.fb.group({
      dni: [{value: '', disabled: true}],
      nombre: [{value: '', disabled: true}],
      telefono: [{value: '', disabled: true}],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.pacienteId = sessionStorage.getItem('id');
    if (this.pacienteId) {
      this.pacienteService.getPaciente(this.pacienteId).subscribe({
        next: (data: any) => {
          this.perfilForm.patchValue({
            dni: data.dni,
            nombre: data.nombre,
            telefono: data.telefono,
            email: data.email
          });
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  actualizarEmail() {
    if (this.perfilForm.valid && this.pacienteId) {
      const email = this.perfilForm.get('email')?.value;
      const dataUpdate: any = { _id: this.pacienteId, email: email };
      this.pacienteService.putPaciente(dataUpdate).subscribe({
        next: () => {
          this.toastr.success('Correo actualizado correctamente');
        },
        error: (err: any) => {
          this.toastr.error('Error al actualizar el correo');
          console.error(err);
        }
      });
    }
  }
}
