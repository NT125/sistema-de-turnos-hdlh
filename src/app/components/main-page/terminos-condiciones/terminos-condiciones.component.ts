import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [NavComponent, FooterComponent, RouterLink],
  templateUrl: './terminos-condiciones.component.html',
  styleUrl: './terminos-condiciones.component.css'
})
export class TerminosCondicionesComponent {

}
