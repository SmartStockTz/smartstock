import { TestBed } from '@angular/core/testing';

import { PlatformApiService } from './platform-api.service';

describe('PlatformApiService', () => {
  let service: PlatformApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
