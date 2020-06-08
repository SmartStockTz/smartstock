import {Component, Inject} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {SupplierI} from '../../../../model/SupplierI';


@Component({
  templateUrl: './show-supplier-mobile-ui.component.html',
  styleUrls: ['./show-supplier.component-mobile-ui.css']
})
export class ShowSupplierMobileUiComponent {
  constructor(public readonly bottomSheetRef: MatBottomSheetRef<ShowSupplierMobileUiComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: SupplierI) {
  }

  getKeys() {
    delete this.data.createdAt;
    delete this.data.updatedAt;
    delete this.data.objectId;
    return Object.keys(this.data);
  }
}
