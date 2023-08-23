import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtoplayComponent } from './howtoplay.component';

describe('HowtoplayComponent', () => {
  let component: HowtoplayComponent;
  let fixture: ComponentFixture<HowtoplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HowtoplayComponent]
    });
    fixture = TestBed.createComponent(HowtoplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
