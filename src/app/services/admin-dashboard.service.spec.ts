import { TestBed } from '@angular/core/testing';

import { AdminDashboardService } from './admin-dashboard.service';

describe('AdminDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminDashboardService = TestBed.get(AdminDashboardService);
    expect(service).toBeTruthy();
  });
});
