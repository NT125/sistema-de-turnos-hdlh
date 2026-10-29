export interface MedicamentoItem {
  item: number | string;
  nombre: string;
  precio: number;
  precioTexto?: string;
  activo?: boolean;
  _id?: string;
}

export interface CarnetInfo {
  id: string;
  nombre: string;
  porcentaje: number;
  descripcion: string;
}

export interface ItemCobroFarmacia {
  item: number | string;
  medicamento: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  porcentajeCobro: number;
  importeCobrar: number;
}

export interface ComprobanteFarmacia {
  _id?: string;
  numeroComprobante?: string;
  fecha: string | Date;
  paciente: string;
  dni: number | string;
  numeroCarnet: string;
  tipoCarnet: string;
  porcentajeCobro: number;
  observaciones?: string;
  items: ItemCobroFarmacia[];
  subtotalGeneral: number;
  totalACobrar: number;
  usuarioEmisor?: string;
  createdAt?: string | Date;
}
