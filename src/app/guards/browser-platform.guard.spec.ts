import { TestBed } from '@angular/core/testing';

import { BrowserPlatformGuard } from './browser-platform.guard';

describe('PlatformGuard', () => {
  let guard: BrowserPlatformGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BrowserPlatformGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
