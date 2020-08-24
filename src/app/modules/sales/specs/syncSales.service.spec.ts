import {TestBed} from '@angular/core/testing';
import {SyncSalesService} from '../services/syncSales.service';


describe('SwSalesProxyService', () => {
  let service: SyncSalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncSalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
