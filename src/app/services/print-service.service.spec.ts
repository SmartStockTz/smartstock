import { TestBed } from '@angular/core/testing';

import { PrintServiceService } from './print-service.service';

describe('PrintServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrintServiceService = TestBed.get(PrintServiceService);
    expect(service).toBeTruthy();
  });
});
