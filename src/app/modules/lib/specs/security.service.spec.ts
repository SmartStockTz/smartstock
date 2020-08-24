import { TestBed } from '@angular/core/testing';

import { SecurityService } from '../services/security.service';
import {HttpClientModule} from '@angular/common/http';

describe('SecurityService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SecurityService,
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: SecurityService<any> = TestBed.inject(SecurityService);
    expect(service).toBeTruthy();
  });
});
