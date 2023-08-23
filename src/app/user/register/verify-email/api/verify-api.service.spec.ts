import { TestBed } from '@angular/core/testing';

import { VerifyApiService } from './verify-api.service';

describe('VerifyApiService', () => {
  let service: VerifyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
