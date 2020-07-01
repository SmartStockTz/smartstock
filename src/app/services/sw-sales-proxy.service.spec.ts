import { TestBed } from '@angular/core/testing';

import { SwSalesProxyService } from './sw-sales-proxy.service';

describe('SwSalesProxyService', () => {
  let service: SwSalesProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwSalesProxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
