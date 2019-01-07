import { TestBed } from '@angular/core/testing';

import { SsmSettingsServiceService } from './ssm-settings-service.service';

describe('SsmSettingsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SsmSettingsServiceService = TestBed.get(SsmSettingsServiceService);
    expect(service).toBeTruthy();
  });
});
