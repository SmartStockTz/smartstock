import { TestBed } from '@angular/core/testing';

import { InfoMessageService } from './info-message.service';

describe('InfoMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfoMessageService = TestBed.get(InfoMessageService);
    expect(service).toBeTruthy();
  });
});
