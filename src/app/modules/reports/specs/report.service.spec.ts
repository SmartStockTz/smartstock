import { TestBed } from '@angular/core/testing';

import { ReportService } from '../services/report.service';

describe('AdminDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportService = TestBed.get(ReportService);
    expect(service).toBeTruthy();
  });
});
