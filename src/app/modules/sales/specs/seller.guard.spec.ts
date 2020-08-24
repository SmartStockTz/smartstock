import { TestBed, async, inject } from '@angular/core/testing';

import { SellerGuard } from '../guards/seller.guard';

describe('SellerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SellerGuard]
    });
  });

  it('should ...', inject([SellerGuard], (guard: SellerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
