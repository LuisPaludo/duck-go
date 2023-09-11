import { TestBed } from '@angular/core/testing';

import { UserPrizesService } from './user-prizes.service';

describe('UserPrizesService', () => {
  let service: UserPrizesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPrizesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
