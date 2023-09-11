import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrizesComponent } from './user-prizes.component';

describe('UserPrizesComponent', () => {
  let component: UserPrizesComponent;
  let fixture: ComponentFixture<UserPrizesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPrizesComponent]
    });
    fixture = TestBed.createComponent(UserPrizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
