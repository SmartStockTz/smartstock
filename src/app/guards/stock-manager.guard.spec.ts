import { TestBed, async, inject } from '@angular/core/testing';

import { StockManagerGuard } from './stock-manager.guard';

describe('StockManagerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockManagerGuard]
    });
  });

  it('should ...', inject([StockManagerGuard], (guard: StockManagerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
