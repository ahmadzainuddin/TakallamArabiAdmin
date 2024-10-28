import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AyatPage } from './ayat.page';

describe('AyatPage', () => {
  let component: AyatPage;
  let fixture: ComponentFixture<AyatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AyatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
