import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitasAsesorPage } from './citas-asesor.page';

describe('CitasAsesorPage', () => {
  let component: CitasAsesorPage;
  let fixture: ComponentFixture<CitasAsesorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CitasAsesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
