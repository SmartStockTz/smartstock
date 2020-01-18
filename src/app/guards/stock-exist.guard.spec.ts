import { TestBed, async, inject } from '@angular/core/testing';

import { StockExistGuard } from './stock-exist.guard';

describe('StockExistGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockExistGuard]
    });
  });

  it('should ...', inject([StockExistGuard], (guard: StockExistGuard) => {
    expect(guard).toBeTruthy();
  }));
});
