import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeAsesorPage } from './home-asesor.page';

describe('HomeAsesorPage', () => {
  let component: HomeAsesorPage;
  let fixture: ComponentFixture<HomeAsesorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAsesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
