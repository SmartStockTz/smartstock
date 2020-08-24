import {TestBed} from '@angular/core/testing';

import {SyncStocksService} from '../services/syncStocks.service';

describe('SwLocalDataService', () => {
  let service: SyncStocksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncStocksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
