import { TestBed } from '@angular/core/testing';

import { SellerDashboardService } from './seller-dashboard.service';

describe('SellerDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SellerDashboardService = TestBed.inject(SellerDashboardService);
    expect(service).toBeTruthy();
  });
});
