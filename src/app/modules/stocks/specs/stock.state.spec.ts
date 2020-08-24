import { TestBed } from '@angular/core/testing';

import { StockState } from '../states/stock.state';

describe('StockDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockState = TestBed.get(StockState);
    expect(service).toBeTruthy();
  });
});
