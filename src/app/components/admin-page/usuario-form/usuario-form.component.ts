import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from '../../../services/paciente.service';
import { ToastrService } from 'ngx-toastr';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AdminNavComponent],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm: FormGroup;
  id: string | null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute,
    private pacienteService: PacienteService
  ) {
    this.usuarioForm = this.fb.group({
      dni: [{value: '', disabled: true}],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.email],
      rol: ['paciente', Validators.required],
      strikes: [0, Validators.required]
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.id) {
      this.pacienteService.getPaciente(this.id).subscribe({
        next: (data: any) => {
          this.usuarioForm.patchValue({
            dni: data.dni,
            nombre: data.nombre,
            telefono: data.telefono,
            email: data.email,
            rol: data.rol,
            strikes: data.strikes
          });
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
  }

  actualizarUsuario() {
    if (this.usuarioForm.valid && this.id) {
      const dataUpdate: any = {
        _id: this.id,
        nombre: this.usuarioForm.get('nombre')?.value,
        telefono: this.usuarioForm.get('telefono')?.value,
        email: this.usuarioForm.get('email')?.value,
        rol: this.usuarioForm.get('rol')?.value,
        strikes: this.usuarioForm.get('strikes')?.value
      };
      
      this.pacienteService.putPaciente(dataUpdate).subscribe({
        next: () => {
          this.toastr.success('Usuario actualizado exitosamente');
          this.router.navigate(['/usuario-list']);
        },
        error: (err: any) => {
          console.error(err);
          this.toastr.error('Error al actualizar');
        }
      });
    }
  }
}
