import { TestBed, async, inject } from '@angular/core/testing';

import { ExistsGuard } from './exists.guard';

describe('StockExistGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExistsGuard]
    });
  });

  it('should ...', inject([ExistsGuard], (guard: ExistsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
