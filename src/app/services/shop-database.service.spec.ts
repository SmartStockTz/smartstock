import { TestBed } from '@angular/core/testing';

import { ShopDatabaseService } from './shop-database.service';

describe('ShopDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopDatabaseService = TestBed.get(ShopDatabaseService);
    expect(service).toBeTruthy();
  });
});
