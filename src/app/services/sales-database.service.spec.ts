import { TestBed } from '@angular/core/testing';

import { SalesDatabaseService } from './sales-database.service';

describe('SalesDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesDatabaseService = TestBed.get(SalesDatabaseService);
    expect(service).toBeTruthy();
  });
});
