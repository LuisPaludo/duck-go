import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { partnerGuard } from './partner.guard';

describe('partnerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => partnerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
