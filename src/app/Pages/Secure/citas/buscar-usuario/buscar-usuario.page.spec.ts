import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarUsuarioPage } from './buscar-usuario.page';

describe('BuscarUsuarioPage', () => {
  let component: BuscarUsuarioPage;
  let fixture: ComponentFixture<BuscarUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
