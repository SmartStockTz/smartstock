import { TestBed } from '@angular/core/testing';

import { SaleUtilsService } from './sale-utils.service';

describe('SaleUtilsService', () => {
  let service: SaleUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
