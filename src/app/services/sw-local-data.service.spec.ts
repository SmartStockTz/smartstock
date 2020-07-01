import { TestBed } from '@angular/core/testing';

import { SwLocalDataService } from './sw-local-data.service';

describe('SwLocalDataService', () => {
  let service: SwLocalDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwLocalDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
