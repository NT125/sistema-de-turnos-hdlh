import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { baseUrl } from '../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-informes-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './informes-page.component.html',
  styleUrl: './informes-page.component.css'
})
export class InformesPageComponent implements OnInit {
  estadisticas: any = null;
  medicamentosMasSolicitados: any[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';

  get totalUnidadesMedicamentos(): number {
    return this.medicamentosMasSolicitados.reduce((acc, m) => acc + (Number(m.totalCantidad) || 0), 0);
  }

  get totalRecaudadoMedicamentos(): number {
    return this.medicamentosMasSolicitados.reduce((acc, m) => acc + (Number(m.totalRecaudado) || 0), 0);
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    const headers = { 'Authorization': sessionStorage.getItem('token') || '' };
    let params = new HttpParams();
    if (this.fechaInicio) params = params.set('fechaInicio', this.fechaInicio);
    if (this.fechaFin) params = params.set('fechaFin', this.fechaFin);

    this.http.get(`${baseUrl}/api/turno/estadisticas`, { headers, params }).subscribe({
      next: (data) => {
        this.estadisticas = data;
      },
      error: (err) => {
        console.error('Error fetching statistics', err);
        this.estadisticas = { totales: {}, porEspecialidad: [], pacientesStrikes: [], turnosPorMedico: [] };
      }
    });

    this.http.get<any[]>(`${baseUrl}/api/recetario/informes/mas-solicitados`, { headers, params }).subscribe({
      next: (data) => {
        this.medicamentosMasSolicitados = data || [];
      },
      error: (err) => {
        console.error('Error fetching medicamentos más solicitados', err);
        this.medicamentosMasSolicitados = [];
      }
    });
  }
}
