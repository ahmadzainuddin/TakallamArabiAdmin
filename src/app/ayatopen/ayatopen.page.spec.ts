import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AyatOpenPage } from './ayatopen.page';

describe('AyatOpenPage', () => {
  let component: AyatOpenPage;
  let fixture: ComponentFixture<AyatOpenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AyatOpenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
