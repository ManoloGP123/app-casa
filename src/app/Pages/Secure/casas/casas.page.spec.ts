import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CasasPage } from './casas.page';

describe('CasasPage', () => {
  let component: CasasPage;
  let fixture: ComponentFixture<CasasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CasasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
