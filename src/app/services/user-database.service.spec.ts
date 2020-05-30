import {TestBed} from '@angular/core/testing';

import {UserDatabaseService} from './user-database.service';
import {HttpClientModule} from '@angular/common/http';

describe('UserDatabaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        UserDatabaseService
      ]
    });
  });

  it('should be created', () => {
    const service: UserDatabaseService = TestBed.inject(UserDatabaseService);
    expect(service).toBeTruthy();
  });

  it('should register a new user', async function () {
    const databaseService: UserDatabaseService = TestBed.inject(UserDatabaseService);
    try {
      const result = await databaseService.register({
        username: 'joshuamshana',
        businessName: 'business',
        country: 'Tanzania',
        email: 'mama27j@gmail.com',
        firstname: 'Joshua',
        lastname: 'Mshana',
        mobile: '0656434821',
        category: 'products',
        region: 'Dar',
        street: 'Kinondoni',
        password: 'joshuamshana'
      });
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  });
});
