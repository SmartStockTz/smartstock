import { TestBed } from '@angular/core/testing';

import { SalesProxyService } from './sales-proxy.service';

describe('SalesProxyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesProxyService = TestBed.get(SalesProxyService);
    expect(service).toBeTruthy();
  });
});
