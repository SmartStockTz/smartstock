import {TestBed} from '@angular/core/testing';

import {UserService} from '../services/user.service';
import {HttpClientModule} from '@angular/common/http';

describe('UserDatabaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        UserService
      ]
    });
  });

  it('should be created', () => {
    const service: UserService = TestBed.inject(UserService);
    expect(service).toBeTruthy();
  });

  it('should register a new user', async function () {
    const databaseService: UserService = TestBed.inject(UserService);
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
