import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitasModalPage } from './citas-modal.page';

describe('CitasModalPage', () => {
  let component: CitasModalPage;
  let fixture: ComponentFixture<CitasModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CitasModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
