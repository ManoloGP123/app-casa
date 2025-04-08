import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalUsuariosPage } from './modal-usuarios.page';

describe('ModalUsuariosPage', () => {
  let component: ModalUsuariosPage;
  let fixture: ComponentFixture<ModalUsuariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
