import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialidadesListComponent } from './especialidades-list.component';

describe('EspecialidadesListComponent', () => {
  let component: EspecialidadesListComponent;
  let fixture: ComponentFixture<EspecialidadesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecialidadesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspecialidadesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
