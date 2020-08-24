import { TestBed } from '@angular/core/testing';

import { PlatformService } from '../services/platform.service';

describe('PlatformApiService', () => {
  let service: PlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
