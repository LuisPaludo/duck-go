import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerGuideComponent } from './partner-guide.component';

describe('PartnerGuideComponent', () => {
  let component: PartnerGuideComponent;
  let fixture: ComponentFixture<PartnerGuideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerGuideComponent]
    });
    fixture = TestBed.createComponent(PartnerGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
