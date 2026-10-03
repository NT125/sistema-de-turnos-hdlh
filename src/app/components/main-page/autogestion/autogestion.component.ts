import { Component } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { OptionCardComponent } from "../../ui/option-card/option-card.component";
import { LoginService } from '../../../services/login.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-autogestion',
  standalone: true,
  imports: [NavComponent, OptionCardComponent, CommonModule, RouterModule],
  templateUrl: './autogestion.component.html',
  styleUrl: './autogestion.component.css'
})
export class AutogestionComponent {
  constructor(public _loginService:LoginService){}
}
