import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CasasModalPage } from './casas-modal.page';

describe('CasasModalPage', () => {
  let component: CasasModalPage;
  let fixture: ComponentFixture<CasasModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CasasModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
