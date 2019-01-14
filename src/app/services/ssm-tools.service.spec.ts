import { TestBed } from '@angular/core/testing';

import { SsmToolsService } from './ssm-tools.service';

describe('SsmToolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SsmToolsService = TestBed.get(SsmToolsService);
    expect(service).toBeTruthy();
  });
});
