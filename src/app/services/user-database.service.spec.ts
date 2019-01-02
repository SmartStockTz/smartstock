import { TestBed } from '@angular/core/testing';

import { UserDatabaseService } from './user-database.service';

describe('UserDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserDatabaseService = TestBed.get(UserDatabaseService);
    expect(service).toBeTruthy();
  });
});
