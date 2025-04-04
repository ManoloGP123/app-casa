import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitasAdminPage } from './citas-admin.page';

describe('CitasAdminPage', () => {
  let component: CitasAdminPage;
  let fixture: ComponentFixture<CitasAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CitasAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
