import { Component } from '@angular/core';
import { OptionCardComponent } from '../../ui/option-card/option-card.component';
import { NavComponent } from '../nav/nav.component';
import { LoginService } from '../../../services/login.service';
import { CarouselComponent } from "../../ui/carousel/carousel.component";
import { AutogestionComponent } from "../autogestion/autogestion.component";
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [OptionCardComponent, NavComponent, CarouselComponent, AutogestionComponent, FooterComponent, RouterLink],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {
  constructor(public _loginService:LoginService){

  }
  fotos = [
    { img: "picsum.photos/300" },
    { img: "picsum.photos/300" },
    { img: "picsum.photos/300" },
    { img: "picsum.photos/300" },
    { img: "picsum.photos/300" },
  ];

  carouselConfig = {
    "slidesToScroll": 4,
    "slidesToShow": 1,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 5000,
    "pauseOnHover": true,
  }

}
