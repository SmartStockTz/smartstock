import { TestBed, async, inject } from '@angular/core/testing';

import { ActiveShopGuard } from './active-shop.guard';

describe('ActiveShopGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiveShopGuard]
    });
  });

  it('should ...', inject([ActiveShopGuard], (guard: ActiveShopGuard) => {
    expect(guard).toBeTruthy();
  }));
});
