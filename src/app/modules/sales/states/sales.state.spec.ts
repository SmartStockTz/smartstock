import { TestBed } from '@angular/core/testing';

import { SalesState } from './sales.state';

describe('SalesDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesState = TestBed.get(SalesState);
    expect(service).toBeTruthy();
  });
});
