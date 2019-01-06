import { TestBed } from '@angular/core/testing';

import { StockDatabaseService } from './stock-database.service';

describe('StockDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockDatabaseService = TestBed.get(StockDatabaseService);
    expect(service).toBeTruthy();
  });
});
