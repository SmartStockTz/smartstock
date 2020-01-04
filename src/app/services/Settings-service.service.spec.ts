import { TestBed } from '@angular/core/testing';

import { SettingsServiceService } from './Settings-service.service';

describe('SsmSettingsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsServiceService = TestBed.get(SettingsServiceService);
    expect(service).toBeTruthy();
  });
});
