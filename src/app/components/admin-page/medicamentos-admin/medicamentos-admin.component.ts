import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';
import { RecetarioService } from '../../../services/recetario.service';
import { MedicamentoItem } from '../../../models/medicamento';

@Component({
  selector: 'app-medicamentos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminNavComponent],
  templateUrl: './medicamentos-admin.component.html',
  styleUrl: './medicamentos-admin.component.css'
})
export class MedicamentosAdminComponent implements OnInit {
  medicamentos: MedicamentoItem[] = [];
  cargando: boolean = false;
  filtroBusqueda: string = '';

  // Modal para agregar/editar
  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  medicamentoSeleccionado: {
    _id?: string;
    item: number | string;
    nombre: string;
    precio: number;
    activo: boolean;
  } = {
    item: 1,
    nombre: '',
    precio: 0,
    activo: true
  };
  guardando: boolean = false;

  constructor(
    private _recetarioService: RecetarioService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarMedicamentos();
  }

  cargarMedicamentos(): void {
    this.cargando = true;
    this._recetarioService.getMedicamentos().subscribe({
      next: (data) => {
        this.medicamentos = data || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al cargar la lista de medicamentos');
        this.cargando = false;
      }
    });
  }

  get medicamentosFiltrados(): MedicamentoItem[] {
    if (!this.filtroBusqueda || this.filtroBusqueda.trim() === '') {
      return this.medicamentos;
    }
    const q = this.filtroBusqueda.toLowerCase().trim();
    return this.medicamentos.filter(m =>
      m.nombre.toLowerCase().includes(q) || `${m.item}`.includes(q)
    );
  }

  // Abrir modal para editar
  abrirModalEditar(med: MedicamentoItem): void {
    this.modoEdicion = true;
    this.medicamentoSeleccionado = {
      _id: med._id,
      item: med.item,
      nombre: med.nombre,
      precio: med.precio,
      activo: true
    };
    this.mostrarModal = true;
  }

  // Abrir modal para nuevo
  abrirModalNuevo(): void {
    this.modoEdicion = false;
    const maxItem = this.medicamentos.reduce((max, m) => {
      const num = Number(m.item);
      return !isNaN(num) && num > max ? num : max;
    }, 0);

    this.medicamentoSeleccionado = {
      item: maxItem + 1,
      nombre: '',
      precio: 0,
      activo: true
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarMedicamento(): void {
    if (!this.medicamentoSeleccionado.nombre || this.medicamentoSeleccionado.nombre.trim() === '') {
      this.toastr.warning('El nombre del medicamento es requerido');
      return;
    }

    if (this.medicamentoSeleccionado.precio === null || this.medicamentoSeleccionado.precio === undefined || this.medicamentoSeleccionado.precio < 0) {
      this.toastr.warning('Ingrese un precio válido');
      return;
    }

    this.guardando = true;

    if (this.modoEdicion && this.medicamentoSeleccionado._id) {
      // Editar existente
      this._recetarioService.actualizarMedicamento(this.medicamentoSeleccionado._id, {
        item: this.medicamentoSeleccionado.item,
        nombre: this.medicamentoSeleccionado.nombre.trim(),
        precio: Number(this.medicamentoSeleccionado.precio),
        activo: this.medicamentoSeleccionado.activo
      }).subscribe({
        next: (res) => {
          this.guardando = false;
          this.toastr.success('Medicamento y precio actualizados con éxito');
          this.cerrarModal();
          this.cargarMedicamentos();
        },
        error: (err) => {
          this.guardando = false;
          console.error(err);
          this.toastr.error('Error al actualizar el medicamento');
        }
      });
    } else {
      // Crear nuevo
      this._recetarioService.crearMedicamento({
        item: this.medicamentoSeleccionado.item,
        nombre: this.medicamentoSeleccionado.nombre.trim(),
        precio: Number(this.medicamentoSeleccionado.precio),
        precioTexto: `$ ${Number(this.medicamentoSeleccionado.precio).toFixed(2)}`
      }).subscribe({
        next: (res) => {
          this.guardando = false;
          this.toastr.success('Nuevo medicamento agregado a la base de datos');
          this.cerrarModal();
          this.cargarMedicamentos();
        },
        error: (err) => {
          this.guardando = false;
          console.error(err);
          this.toastr.error('Error al agregar medicamento');
        }
      });
    }
  }

  eliminarMedicamento(med: MedicamentoItem): void {
    if (!med._id) {
      this.toastr.warning('No se puede eliminar un medicamento sin ID en la base de datos');
      return;
    }

    if (confirm(`¿Está seguro de eliminar el medicamento "${med.nombre}" de la base de datos?`)) {
      this._recetarioService.eliminarMedicamento(med._id).subscribe({
        next: () => {
          this.toastr.success('Medicamento eliminado de la base de datos');
          this.cargarMedicamentos();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Error al eliminar el medicamento');
        }
      });
    }
  }
}
