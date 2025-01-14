import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { NavComponent } from './components/main-page/nav/nav.component';
import { FooterComponent } from './components/main-page/footer/footer.component';
import { BodyComponent } from './components/main-page/body/body.component';
import { EsepcialidadesPageComponent } from "./components/esepcialidades-page/esepcialidades-page.component";
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { MedicosListComponent } from "./components/admin-page/medicos-list/medicos-list.component";
import { UsuariosListComponent } from './components/admin-page/usuarios-list/usuarios-list.component';
import { OptionCardComponent } from "./components/ui/option-card/option-card.component";
import { MedicoFormComponent } from "./components/admin-page/medico-form/medico-form.component";
import { SecretariaPageComponent } from "./components/secretaria-page/secretaria-page.component";
import { MisTurnosComponent } from './components/mis-turnos/mis-turnos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
  
    FooterComponent,
   
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'prototipo-turnos-web';
}
