import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { register } from 'swiper/element';
register();

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  indice: number = 0;

  fotos = [
    { img: "/slider/1.jpg" },
    { img: "/slider/2.jpg" },
    { img: "/slider/3.jpg" },
    { img: "/slider/4.jpg" },
    { img: "/slider/5.jpg" },
    { img: "/slider/6.jpg" },
    { img: "/slider/7.jpg" },
    { img: "/slider/8.jpg" },
    { img: "/slider/9.jpg" },
    { img: "/slider/10.jpg" },
    { img: "/slider/11.jpg" },
    { img: "/slider/12.jpg" },
    { img: "/slider/13.jpg" },
    { img: "/slider/14.jpg" },
    { img: "/slider/15.jpg" },
    { img: "/slider/16.jpg" },
  ];

  getImagen(): string {
    return this.fotos[this.indice].img;
  }

  sumarIndice(){
    if (this.indice === this.fotos.length - 1){
      this.indice = 0;
    } else {
      this.indice++;
    }
  }

  restarIndice(){
    if (this.indice === 0){
      this.indice = this.fotos.length - 1;
    } else {
      this.indice--;
    }
  }

  irAIndice(indice: number){
    this.indice = indice;
  }

}
/*
swiperElement = signal<SwiperContainer | null>(null);
 
ngOnInit(): void {
  const swiperConstructor = document.querySelector('swiper-container');
  const swiperOptions: SwiperOptions = {
    slidesPerView: 1,
    loop: true
  };
  Object.assign(swiperConstructor!, swiperOptions);
  this.swiperElement.set(swiperConstructor as SwiperContainer);
  this.swiperElement()?.initialize();
}*/

