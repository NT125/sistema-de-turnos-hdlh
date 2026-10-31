import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminNavComponent } from '../admin-page/admin-nav/admin-nav.component';
import { RecetarioService } from '../../services/recetario.service';
import { LoginService } from '../../services/login.service';
import { ComprobanteFarmacia, ItemCobroFarmacia, MedicamentoItem } from '../../models/medicamento';
import { CARNETS_DATA, MEDICAMENTOS_DATA } from '../../data/medicamentos.data';

@Component({
  selector: 'app-recetario-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminNavComponent],
  templateUrl: './recetario-page.component.html',
  styleUrl: './recetario-page.component.css'
})
export class RecetarioPageComponent implements OnInit {
  // Datos de cabecera
  fecha: string = '';
  paciente: string = '';
  dni: string = '';
  numeroCarnet: string = '';
  tipoCarnet: string = 'Carnet 1';
  porcentajeAplicado: number = 0;
  observaciones: string = '';
  numeroComprobanteActual: string = '';

  // Lista de carnets disponibles con sus reglas
  carnets = CARNETS_DATA;

  // Catálogo completo de medicamentos con precios verdaderos
  medicamentosCatalogo: MedicamentoItem[] = MEDICAMENTOS_DATA;
  filtroCatalogo: string = '';

  // Items de la grilla de cobro
  items: ItemCobroFarmacia[] = [];

  // Estado UI
  cargandoMedicamentos: boolean = false;
  guardando: boolean = false;
  buscandoPaciente: boolean = false;
  mostrarHistorial: boolean = false;
  mostrarCatalogoModal: boolean = false;

  // Historial de comprobantes
  comprobantesHistorial: ComprobanteFarmacia[] = [];
  filtroHistorial: string = '';
  fechaFiltroHistorial: string = '';

  // Vista activa de la pantalla de recetario
  vistaActual: 'inicio' | 'comprobante' | 'medicamentos' = 'inicio';

  // Informes de medicamentos más solicitados
  medicamentosMasSolicitados: any[] = [];
  fechaInicioSolicitados: string = '';
  fechaFinSolicitados: string = '';
  cargandoSolicitados: boolean = false;

  // Modal para eliminar comprobante con contraseña
  mostrarModalEliminar: boolean = false;
  comprobanteAEliminar: ComprobanteFarmacia | null = null;
  passwordEliminar: string = '';
  mostrarPassEliminar: boolean = false;
  eliminandoComprobante: boolean = false;

  // Gestión de medicamentos
  filtroGestionMed: string = '';
  mostrarModalMed: boolean = false;
  modoEdicionMed: boolean = false;
  guardandoMed: boolean = false;
  medSeleccionado: any = {
    item: 1,
    nombre: '',
    precio: 0,
    activo: true
  };

  constructor(
    public _recetarioService: RecetarioService,
    public _loginService: LoginService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Establecer fecha de hoy en formato YYYY-MM-DD
    const hoy = new Date();
    this.fecha = hoy.toISOString().split('T')[0];
    this.fechaFiltroHistorial = this.fecha;

    this.actualizarPorcentajeCarnet();
    this.cargarMedicamentos();
    this.cargarMedicamentosMasSolicitados();

    // Iniciar con al menos una fila vacía
    this.agregarItem();
  }

  cargarMedicamentos(): void {
    this.cargandoMedicamentos = true;
    this._recetarioService.getMedicamentos().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.medicamentosCatalogo = data;
        } else {
          this.medicamentosCatalogo = MEDICAMENTOS_DATA;
        }
        this.cargandoMedicamentos = false;
      },
      error: () => {
        this.medicamentosCatalogo = MEDICAMENTOS_DATA;
        this.cargandoMedicamentos = false;
      }
    });
  }

  // Cambio de tipo de carnet: recalcula inmediatamente el porcentaje y todas las filas
  onCarnetChange(): void {
    this.actualizarPorcentajeCarnet();
    this.recalcularTodasLasFilas();
  }

  // Seleccionar carnet haciendo clic en las tarjetas superiores
  seleccionarCarnet(nombre: string): void {
    this.tipoCarnet = nombre;
    this.onCarnetChange();
  }

  actualizarPorcentajeCarnet(): void {
    const carnetEncontrado = this.carnets.find(c => c.nombre === this.tipoCarnet);
    if (carnetEncontrado) {
      this.porcentajeAplicado = carnetEncontrado.porcentaje;
    } else {
      if (this.tipoCarnet === 'Carnet 1') this.porcentajeAplicado = 0;
      else if (this.tipoCarnet === 'Carnet 2') this.porcentajeAplicado = 30;
      else if (this.tipoCarnet === 'Carnet 3') this.porcentajeAplicado = 50;
      else this.porcentajeAplicado = 100;
    }
  }

  // Agregar una fila a la grilla
  agregarItem(): void {
    const nuevoNumero = this.items.length + 1;
    this.items.push({
      item: nuevoNumero,
      medicamento: '',
      cantidad: 1,
      precioUnitario: 0,
      subtotal: 0,
      porcentajeCobro: this.porcentajeAplicado,
      importeCobrar: 0
    });
  }

  // Eliminar una fila
  eliminarItem(index: number): void {
    if (this.items.length === 1) {
      // Si es la única fila, solo la resetea
      this.items[0] = {
        item: 1,
        medicamento: '',
        cantidad: 1,
        precioUnitario: 0,
        subtotal: 0,
        porcentajeCobro: this.porcentajeAplicado,
        importeCobrar: 0
      };
      return;
    }

    this.items.splice(index, 1);
    // Reindexar items
    this.items.forEach((it, idx) => it.item = idx + 1);
  }

  // Cuando el usuario selecciona un medicamento de la lista
  onMedicamentoSeleccionado(index: number, nombreMedicamento: string): void {
    const med = this.medicamentosCatalogo.find(m => m.nombre === nombreMedicamento);
    if (med) {
      this.items[index].medicamento = med.nombre;
      this.items[index].precioUnitario = med.precio;
    } else {
      this.items[index].precioUnitario = 0;
    }
    this.recalcularFila(index);
  }

  // Cuando cambia la cantidad
  onCantidadChange(index: number): void {
    if (this.items[index].cantidad < 1 || !this.items[index].cantidad) {
      this.items[index].cantidad = 1;
    }
    this.recalcularFila(index);
  }

  // Recalcular una sola fila
  recalcularFila(index: number): void {
    const fila = this.items[index];
    fila.subtotal = Number((fila.cantidad * fila.precioUnitario).toFixed(2));
    fila.porcentajeCobro = this.porcentajeAplicado;
    fila.importeCobrar = Number(((fila.subtotal * fila.porcentajeCobro) / 100).toFixed(2));
  }

  // Recalcular todas las filas (por ejemplo al cambiar de carnet)
  recalcularTodasLasFilas(): void {
    this.items.forEach((_, idx) => this.recalcularFila(idx));
  }

  // Agregar medicamento desde el catálogo modal
  agregarDesdeCatalogo(med: MedicamentoItem): void {
    // Si la última fila está vacía, usarla; si no, crear una nueva
    const ultimaFila = this.items[this.items.length - 1];
    if (ultimaFila && !ultimaFila.medicamento) {
      ultimaFila.medicamento = med.nombre;
      ultimaFila.precioUnitario = med.precio;
      this.recalcularFila(this.items.length - 1);
    } else {
      this.items.push({
        item: this.items.length + 1,
        medicamento: med.nombre,
        cantidad: 1,
        precioUnitario: med.precio,
        subtotal: med.precio,
        porcentajeCobro: this.porcentajeAplicado,
        importeCobrar: Number(((med.precio * this.porcentajeAplicado) / 100).toFixed(2))
      });
    }
    this.toastr.info(`Agregado: ${med.nombre}`);
  }

  // Totales
  get totalCantidadMedicamentos(): number {
    return this.items.reduce((acc, it) => acc + (it.medicamento ? Number(it.cantidad || 0) : 0), 0);
  }

  get subtotalGeneral(): number {
    const total = this.items.reduce((acc, it) => acc + (it.subtotal || 0), 0);
    return Number(total.toFixed(2));
  }

  get totalDescuento(): number {
    const desc = this.subtotalGeneral - this.totalACobrar;
    return Number(desc.toFixed(2));
  }

  get totalACobrar(): number {
    const total = this.items.reduce((acc, it) => acc + (it.importeCobrar || 0), 0);
    return Number(total.toFixed(2));
  }

  // Buscar paciente por DNI en el sistema
  buscarPacientePorDni(): void {
    if (!this.dni || `${this.dni}`.trim() === '') {
      this.toastr.warning('Ingrese un número de DNI para buscar');
      return;
    }

    const dniLimpio = `${this.dni}`.trim().replace(/\D/g, '');
    if (!dniLimpio) {
      this.toastr.warning('El DNI ingresado no es válido');
      return;
    }
    this.dni = dniLimpio;

    this.buscandoPaciente = true;
    this._recetarioService.buscarPacientePorDni(dniLimpio).subscribe({
      next: (res) => {
        this.buscandoPaciente = false;
        let pac: any = null;
        if (Array.isArray(res) && res.length > 0) {
          pac = res[0];
        } else if (res && (res.nombre || res._id)) {
          pac = res;
        }

        if (pac && pac.nombre) {
          const nombreCompleto = pac.apellido ? `${pac.nombre} ${pac.apellido}` : pac.nombre;
          this.paciente = nombreCompleto;
          this.toastr.success(`Paciente encontrado: ${nombreCompleto}`);
        } else {
          this.toastr.info('No se encontró paciente registrado con ese DNI. Puede ingresarlo manualmente.');
        }
      },
      error: () => {
        this.buscandoPaciente = false;
        this.toastr.info('No se encontró paciente con ese DNI. Puede ingresarlo manualmente.');
      }
    });
  }

  // Guardar comprobante
  guardarComprobante(): void {
    const itemsValidos = this.items.filter(it => it.medicamento && it.medicamento.trim() !== '');

    if (!this.paciente || this.paciente.trim() === '') {
      this.toastr.warning('Por favor ingrese el nombre del Paciente');
      return;
    }

    if (!this.dni || `${this.dni}`.trim() === '') {
      this.toastr.warning('Por favor ingrese el DNI del Paciente');
      return;
    }

    if (itemsValidos.length === 0) {
      this.toastr.warning('Debe cargar al menos un medicamento con descripción');
      return;
    }

    const comprobante: ComprobanteFarmacia = {
      fecha: this.fecha,
      paciente: this.paciente.trim(),
      dni: this.dni,
      numeroCarnet: this.numeroCarnet ? this.numeroCarnet.trim() : '',
      tipoCarnet: this.tipoCarnet,
      porcentajeCobro: this.porcentajeAplicado,
      observaciones: this.observaciones ? this.observaciones.trim() : '',
      items: itemsValidos,
      subtotalGeneral: this.subtotalGeneral,
      totalACobrar: this.totalACobrar,
      usuarioEmisor: this._loginService.userLogged() || 'Recetario'
    };

    this.guardando = true;
    this._recetarioService.guardarComprobante(comprobante).subscribe({
      next: (res) => {
        this.guardando = false;
        this.toastr.success('Comprobante registrado y guardado exitosamente');
        if (res.comprobante && res.comprobante.numeroComprobante) {
          this.numeroComprobanteActual = res.comprobante.numeroComprobante;
        }
      },
      error: (err) => {
        this.guardando = false;
        console.error(err);
        this.toastr.error('Error al guardar el comprobante');
      }
    });
  }

  // Imprimir comprobante
  imprimirComprobante(): void {
    const itemsValidos = this.items.filter(it => it.medicamento && it.medicamento.trim() !== '');
    if (itemsValidos.length === 0) {
      this.toastr.warning('Cargue al menos un medicamento para imprimir el comprobante');
      return;
    }
    window.print();
  }

  // Reiniciar formulario para un nuevo comprobante
  nuevoComprobante(): void {
    if (confirm('¿Desea iniciar un nuevo comprobante en blanco?')) {
      this.paciente = '';
      this.dni = '';
      this.numeroCarnet = '';
      this.tipoCarnet = 'Carnet 1';
      this.observaciones = '';
      this.numeroComprobanteActual = '';
      const hoy = new Date();
      this.fecha = hoy.toISOString().split('T')[0];
      this.actualizarPorcentajeCarnet();
      this.items = [];
      this.agregarItem();
      this.toastr.info('Nuevo comprobante en blanco iniciado');
    }
  }

  // Historial de comprobantes
  toggleHistorial(): void {
    this.mostrarHistorial = !this.mostrarHistorial;
    if (this.mostrarHistorial) {
      this.cargarHistorial();
    }
  }

  cargarHistorial(): void {
    this._recetarioService.getComprobantes(this.filtroHistorial, this.fechaFiltroHistorial).subscribe({
      next: (data) => {
        this.comprobantesHistorial = data || [];
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo cargar el historial');
      }
    });
  }

  cargarComprobanteEnPantalla(c: ComprobanteFarmacia): void {
    this.paciente = c.paciente;
    this.dni = `${c.dni}`;
    this.numeroCarnet = c.numeroCarnet || '';
    this.tipoCarnet = c.tipoCarnet;
    this.porcentajeAplicado = c.porcentajeCobro;
    this.observaciones = c.observaciones || '';
    this.numeroComprobanteActual = c.numeroComprobante || '';
    if (c.fecha) {
      this.fecha = new Date(c.fecha).toISOString().split('T')[0];
    }
    this.items = c.items.map((it, idx) => ({ ...it, item: idx + 1 }));
    this.mostrarHistorial = false;
    this.toastr.info(`Comprobante ${c.numeroComprobante || ''} cargado en pantalla`);
  }

  // Modal catálogo
  toggleCatalogoModal(): void {
    this.mostrarCatalogoModal = !this.mostrarCatalogoModal;
  }

  get medicamentosFiltrados(): MedicamentoItem[] {
    if (!this.filtroCatalogo || this.filtroCatalogo.trim() === '') {
      return this.medicamentosCatalogo;
    }
    const q = this.filtroCatalogo.toLowerCase().trim();
    return this.medicamentosCatalogo.filter(m =>
      m.nombre.toLowerCase().includes(q) || `${m.item}`.includes(q)
    );
  }

  // Cambio de vista en pantalla principal
  cambiarVista(vista: 'inicio' | 'comprobante' | 'medicamentos'): void {
    this.vistaActual = vista;
    if (vista === 'medicamentos') {
      this.cargarMedicamentos();
    }
    if (vista === 'inicio') {
      this.cargarMedicamentosMasSolicitados();
    }
  }

  // Informe de medicamentos más solicitados
  cargarMedicamentosMasSolicitados(): void {
    this.cargandoSolicitados = true;
    this._recetarioService.getMedicamentosMasSolicitados(this.fechaInicioSolicitados, this.fechaFinSolicitados).subscribe({
      next: (data) => {
        this.medicamentosMasSolicitados = data || [];
        this.cargandoSolicitados = false;
      },
      error: (err) => {
        console.error('Error al cargar medicamentos solicitados:', err);
        this.cargandoSolicitados = false;
      }
    });
  }

  reiniciarFiltroSolicitados(): void {
    this.fechaInicioSolicitados = '';
    this.fechaFinSolicitados = '';
    this.cargarMedicamentosMasSolicitados();
  }

  get totalUnidadesSolicitadas(): number {
    return this.medicamentosMasSolicitados.reduce((acc, m) => acc + (Number(m.totalCantidad) || 0), 0);
  }

  get totalRecaudadoSolicitados(): number {
    return this.medicamentosMasSolicitados.reduce((acc, m) => acc + (Number(m.totalRecaudado) || 0), 0);
  }

  // Eliminación de comprobante con contraseña
  solicitarEliminarComprobante(comp: ComprobanteFarmacia, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.comprobanteAEliminar = comp;
    this.passwordEliminar = '';
    this.mostrarPassEliminar = false;
    this.mostrarModalEliminar = true;
  }

  solicitarEliminarComprobanteActual(): void {
    if (!this.numeroComprobanteActual || this.numeroComprobanteActual === 'NUEVO') {
      this.toastr.info('No hay un comprobante guardado cargado en pantalla.');
      return;
    }
    const comp = this.comprobantesHistorial.find(c => c.numeroComprobante === this.numeroComprobanteActual);
    if (comp) {
      this.solicitarEliminarComprobante(comp);
    } else {
      this.toggleHistorial();
      this.toastr.info('Seleccione el comprobante que desea eliminar en el historial.');
    }
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.comprobanteAEliminar = null;
    this.passwordEliminar = '';
    this.mostrarPassEliminar = false;
  }

  toggleMostrarPassEliminar(): void {
    this.mostrarPassEliminar = !this.mostrarPassEliminar;
  }

  confirmarEliminarComprobante(): void {
    if (!this.comprobanteAEliminar || !this.comprobanteAEliminar._id) {
      this.toastr.warning('Comprobante no válido');
      return;
    }
    if (!this.passwordEliminar || this.passwordEliminar.trim() === '') {
      this.toastr.warning('Por favor ingrese la contraseña de autorización');
      return;
    }

    this.eliminandoComprobante = true;
    this._recetarioService.eliminarComprobante(this.comprobanteAEliminar._id, this.passwordEliminar.trim()).subscribe({
      next: (res) => {
        this.eliminandoComprobante = false;
        this.toastr.success(res.msg || 'Comprobante eliminado con éxito');
        
        // Si el comprobante eliminado estaba cargado en pantalla, resetear
        if (this.numeroComprobanteActual === this.comprobanteAEliminar?.numeroComprobante) {
          this.nuevoComprobanteSilencioso();
        }

        this.cerrarModalEliminar();
        this.cargarHistorial();
        this.cargarMedicamentosMasSolicitados();
      },
      error: (err) => {
        this.eliminandoComprobante = false;
        console.error(err);
        this.toastr.error(err.error?.msg || 'Contraseña incorrecta. No se pudo eliminar el comprobante.');
      }
    });
  }

  nuevoComprobanteSilencioso(): void {
    this.paciente = '';
    this.dni = '';
    this.numeroCarnet = '';
    this.tipoCarnet = 'Carnet 1';
    this.observaciones = '';
    this.numeroComprobanteActual = '';
    const hoy = new Date();
    this.fecha = hoy.toISOString().split('T')[0];
    this.actualizarPorcentajeCarnet();
    this.items = [];
    this.agregarItem();
  }

  // Gestión de catálogo de medicamentos
  get medicamentosGestionFiltrados(): MedicamentoItem[] {
    if (!this.filtroGestionMed || this.filtroGestionMed.trim() === '') {
      return this.medicamentosCatalogo;
    }
    const q = this.filtroGestionMed.toLowerCase().trim();
    return this.medicamentosCatalogo.filter(m =>
      m.nombre.toLowerCase().includes(q) || `${m.item}`.includes(q)
    );
  }

  abrirModalNuevoMed(): void {
    this.modoEdicionMed = false;
    const maxItem = this.medicamentosCatalogo.reduce((max, m) => {
      const num = Number(m.item);
      return !isNaN(num) && num > max ? num : max;
    }, 0);

    this.medSeleccionado = {
      item: maxItem + 1,
      nombre: '',
      precio: 0,
      activo: true
    };
    this.mostrarModalMed = true;
  }

  abrirModalEditarMed(med: MedicamentoItem): void {
    this.modoEdicionMed = true;
    this.medSeleccionado = {
      _id: med._id,
      item: med.item,
      nombre: med.nombre,
      precio: med.precio,
      activo: true
    };
    this.mostrarModalMed = true;
  }

  cerrarModalMed(): void {
    this.mostrarModalMed = false;
  }

  guardarMedicamento(): void {
    if (!this.medSeleccionado.nombre || this.medSeleccionado.nombre.trim() === '') {
      this.toastr.warning('El nombre del medicamento es requerido');
      return;
    }
    if (this.medSeleccionado.precio === null || this.medSeleccionado.precio === undefined || this.medSeleccionado.precio < 0) {
      this.toastr.warning('Ingrese un precio válido');
      return;
    }

    this.guardandoMed = true;
    if (this.modoEdicionMed && this.medSeleccionado._id) {
      this._recetarioService.actualizarMedicamento(this.medSeleccionado._id, {
        item: this.medSeleccionado.item,
        nombre: this.medSeleccionado.nombre.trim(),
        precio: Number(this.medSeleccionado.precio),
        activo: this.medSeleccionado.activo
      }).subscribe({
        next: () => {
          this.guardandoMed = false;
          this.toastr.success('Medicamento y precio actualizados con éxito');
          this.cerrarModalMed();
          this.cargarMedicamentos();
        },
        error: (err) => {
          this.guardandoMed = false;
          console.error(err);
          this.toastr.error('Error al actualizar medicamento');
        }
      });
    } else {
      this._recetarioService.crearMedicamento({
        item: this.medSeleccionado.item,
        nombre: this.medSeleccionado.nombre.trim(),
        precio: Number(this.medSeleccionado.precio),
        precioTexto: `$ ${Number(this.medSeleccionado.precio).toFixed(2)}`
      }).subscribe({
        next: () => {
          this.guardandoMed = false;
          this.toastr.success('Nuevo medicamento agregado a la base de datos');
          this.cerrarModalMed();
          this.cargarMedicamentos();
        },
        error: (err) => {
          this.guardandoMed = false;
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
          this.toastr.error('Error al eliminar medicamento');
        }
      });
    }
  }
}
