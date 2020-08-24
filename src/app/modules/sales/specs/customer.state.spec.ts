import { TestBed } from '@angular/core/testing';

import { CustomerState } from '../states/customer.state';

describe('CustomerApiService', () => {
  let service: CustomerState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
