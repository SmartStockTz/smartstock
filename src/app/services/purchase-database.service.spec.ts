import { TestBed } from '@angular/core/testing';

import { PurchaseDatabaseService } from './purchase-database.service';

describe('PurchaseDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchaseDatabaseService = TestBed.get(PurchaseDatabaseService);
    expect(service).toBeTruthy();
  });
});
