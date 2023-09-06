import { TestBed } from '@angular/core/testing';

import { CreatePrizeService } from './create-prize.service';

describe('CreatePrizeService', () => {
  let service: CreatePrizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePrizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
