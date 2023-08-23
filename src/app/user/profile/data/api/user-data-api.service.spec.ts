import { TestBed } from '@angular/core/testing';

import { UserDataApiService } from './user-data-api.service';

describe('UserDataApiService', () => {
  let service: UserDataApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDataApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
