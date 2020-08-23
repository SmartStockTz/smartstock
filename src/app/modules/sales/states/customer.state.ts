import {Injectable} from '@angular/core';
import {CustomerModel} from '../models/customer.model';
/***** move to common ********/
import {StorageService} from '../../lib/services/storage.service';

/***** move to common ********/

@Injectable({
  providedIn: 'root'
})
export class CustomerState {

  constructor(private readonly storage: StorageService) {
  }

  getCustomers(): Promise<CustomerModel[]> {
    return this.storage.getCustomers();
  }

  saveCustomer(customer: CustomerModel): Promise<CustomerModel> {
    return this.storage.saveCustomer(customer);
  }
}
