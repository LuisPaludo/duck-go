import { TestBed } from '@angular/core/testing';

import { ApiPointsService } from './api-points.service';

describe('ApiPointsService', () => {
  let service: ApiPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
