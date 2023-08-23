import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupounsComponent } from './cupouns.component';

describe('CupounsComponent', () => {
  let component: CupounsComponent;
  let fixture: ComponentFixture<CupounsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CupounsComponent]
    });
    fixture = TestBed.createComponent(CupounsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
