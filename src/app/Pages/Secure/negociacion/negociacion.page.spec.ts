import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NegociacionPage } from './negociacion.page';

describe('NegociacionPage', () => {
  let component: NegociacionPage;
  let fixture: ComponentFixture<NegociacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NegociacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
