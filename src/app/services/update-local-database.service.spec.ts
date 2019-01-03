import { TestBed } from '@angular/core/testing';

import { UpdateLocalDatabaseService } from './update-local-database.service';

describe('UpdateLocalDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateLocalDatabaseService = TestBed.get(UpdateLocalDatabaseService);
    expect(service).toBeTruthy();
  });
});
