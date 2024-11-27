import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from "../main-page/nav/nav.component";
import { RouterLink, Router} from '@angular/router';
import { EspecialidadService } from '../../services/especialidad.service';
 
@Component({
  selector: 'app-esepcialidades-page',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    RouterLink
],
  templateUrl: './esepcialidades-page.component.html',
  styleUrl: './esepcialidades-page.component.css'
})
export class EsepcialidadesPageComponent implements OnInit {
  ngOnInit(): void {
    this.getEspecialidades();
    //this.getEspecialidad();
  }
  constructor(public _especialidadService:EspecialidadService, private route:Router){
    
  }
  getEspecialidad(){
    this._especialidadService.getEspecialidad('66d7e1d5a93d91e9064ecb3e').subscribe({
      next:(data) => {
        console.log(data);
        
      },
      error:(e) => {
        console.log(e);
      },
      
    })
  }
  getEspecialidades() {
    this._especialidadService.getEspecialidadesMedico().subscribe({
      next:(data) => {
        this._especialidadService.especialidades=data;
        
      },
      error:(e) => {
        console.log(e);
      },
      
    })
  }
  
  ToMedicos(id:any){
    this.route.navigate(['form-turno/',id]);
  }
  
}
