import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PacienteService } from '../../../services/paciente.service';
import { ToastrService } from 'ngx-toastr';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, AdminNavComponent],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm: FormGroup;
  id: string | null;
  nuevaPassword: string = '';
  confirmarPassword: string = '';
  mostrarPass: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute,
    private pacienteService: PacienteService,
    public loginService: LoginService
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

  isRolEspecial(): boolean {
    const rol = this.usuarioForm.get('rol')?.value;
    return rol === 'admin' || rol === 'secretaria' || rol === 'recetario' || rol === 'terminal';
  }

  toggleMostrarPass(): void {
    this.mostrarPass = !this.mostrarPass;
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

      // Si el rol es especial y se ingresó una nueva contraseña desde admin
      if (this.isRolEspecial() && this.nuevaPassword.trim() !== '') {
        if (this.nuevaPassword !== this.confirmarPassword) {
          this.toastr.error('Las contraseñas no coinciden');
          return;
        }
        if (this.nuevaPassword.trim().length < 4) {
          this.toastr.warning('La contraseña debe tener al menos 4 caracteres');
          return;
        }
        dataUpdate.passw = this.nuevaPassword.trim();
      }
      
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

  cambiarSoloPassword(): void {
    if (!this.id) return;
    if (!this.nuevaPassword || this.nuevaPassword.trim() === '') {
      this.toastr.warning('Por favor ingrese una nueva contraseña');
      return;
    }
    if (this.nuevaPassword !== this.confirmarPassword) {
      this.toastr.error('Las contraseñas no coinciden');
      return;
    }
    if (this.nuevaPassword.trim().length < 4) {
      this.toastr.warning('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    this.pacienteService.cambiarPasswordAdmin(this.id, this.nuevaPassword.trim()).subscribe({
      next: (res: any) => {
        this.toastr.success(res.msg || 'Contraseña actualizada exitosamente');
        this.nuevaPassword = '';
        this.confirmarPassword = '';
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error(err.error?.msg || 'Error al cambiar contraseña');
      }
    });
  }
}
