import { TestBed } from '@angular/core/testing';

import { CouponsApiService } from './coupons-api.service';

describe('CouponsApiService', () => {
  let service: CouponsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouponsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
