import { TestBed, async, inject } from '@angular/core/testing';

import { KeeperGuard } from './keeper.guard';

describe('StockManagerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeeperGuard]
    });
  });

  it('should ...', inject([KeeperGuard], (guard: KeeperGuard) => {
    expect(guard).toBeTruthy();
  }));
});
