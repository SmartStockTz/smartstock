import { TestBed } from '@angular/core/testing';

import { BillingApiService } from '../services/billing-api.service';

describe('BillingApiService', () => {
  let service: BillingApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
