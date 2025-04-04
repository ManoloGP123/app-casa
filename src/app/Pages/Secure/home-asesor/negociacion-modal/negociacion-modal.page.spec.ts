import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NegociacionModalPage } from './negociacion-modal.page';

describe('NegociacionModalPage', () => {
  let component: NegociacionModalPage;
  let fixture: ComponentFixture<NegociacionModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NegociacionModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
