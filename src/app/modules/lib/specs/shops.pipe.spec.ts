import {ShopsPipe} from '../pipes/shops.pipe';
import {TestBed} from '@angular/core/testing';
import {UserDatabaseService} from '../../services/user-database.service';

describe('ShopsPipe', () => {
  beforeEach(function () {
    TestBed.configureCompiler({
      providers: [UserDatabaseService]
    });
  });

  it('create an instance', () => {
    const userDatabaseService: UserDatabaseService = TestBed.inject(UserDatabaseService);
    const pipe = new ShopsPipe(userDatabaseService);
    expect(pipe).toBeTruthy();
  });
});
