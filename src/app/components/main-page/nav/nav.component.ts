import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  isNavMenuHidden: boolean = true;
  constructor(public _loginService:LoginService){

  }
  toggleMenu = () => {
    this.isNavMenuHidden = ! this.isNavMenuHidden;
  }
  public logout() {
    this._loginService.logout();
  }
  public getPanelRoute(): string {
    const rol = this._loginService.rolLogged();
    if (rol === 'admin') return '/admin';
    if (rol === 'secretaria') return '/secretaria';
    if (rol === 'recetario') return '/recetario';
    if (rol === 'terminal') return '/terminal';
    return '/';
  }
}
