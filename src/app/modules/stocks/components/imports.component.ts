import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LogService} from '../../../services/log.service';
import {StockState} from '../states/stock.state';

@Component({
  selector: 'app-upload-products',
  template: `
    <div>
      <div class="d-flex flex-row align-items-center" mat-dialog-title>
        Import Products
        <span style="flex-grow: 1"></span>
        <button (click)="fileU.click()" [disabled]="importProgress" class="ft-button" color="primary" mat-flat-button>
          Upload Csv
          <mat-progress-spinner *ngIf="importProgress" style="display: inline-block" diameter="30"
                                mode="indeterminate"></mat-progress-spinner>
        </button>
      </div>
      <mat-divider></mat-divider>
      <div mat-dialog-content>
        <p>
          <br>
          Prepare your excel sheet and change it to CSV then upload it here.<br>
          Your excel sheet must contain the following columns<br>
          <u>Note: CSV delimiter must be </u> ( , )
        </p>
        <div>
          <table class="table table-responsive table-bordered table-hover">
            <tr class="table-data-row">
              <th>Column Name</th>
              <th>Description</th>
            </tr>
            <tr>
              <td>product</td>
              <td>Product name <u>e.g panadol - 10mg</u></td>
            </tr>
            <tr>
              <td>description</td>
              <td>Product description <u>e.g medicine for headache</u></td>
            </tr>
            <tr>
              <td>purchase</td>
              <td>Purchase price of a product <u>e.g 1000</u></td>
            </tr>
            <tr>
              <td>unit</td>
              <td>Unit of a product <u>e.g tablet</u></td>
            </tr>
            <tr>
              <td>retailPrice</td>
              <td>Retail price for a product <u>e.g 1400</u></td>
            </tr>
            <tr>
              <td>wholesalePrice</td>
              <td>Wholesale price for a product <u>e.g 5000</u></td>
            </tr>
            <tr>
              <td>wholesaleQuantity</td>
              <td>how many unit quantity of product to be reduced when product sold as a whole <u>e.g 3</u></td>
            </tr>
            <tr>
              <td>quantity</td>
              <td>Initial stock quantity <u>e.g 200</u></td>
            </tr>
            <tr>
              <td>supplier</td>
              <td>Name of supplier <u>e.g Joe Shop</u></td>
            </tr>
            <tr>
              <td>reorder</td>
              <td>Reorder level <u>e.g 5</u></td>
            </tr>
            <tr>
              <td>category</td>
              <td>Reorder level <u>e.g 5</u></td>
            </tr>
            <tr>
              <td>expire</td>
              <td>Expire date <u>e.g 2050-01-01</u></td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <input #fileU style="display: none" (change)="csvUploaded($event)" type="file" accept=".csv">
  `,
  styleUrls: ['../styles/imports.style.css']
})
export class ImportsDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ImportsDialogComponent>,
              private snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly stockApi: StockState) {
  }

  importProgress = false;

  private static _sanitizeField(value: string): any {
    if (!isNaN(Number(value))) {
      return Number(value);
    }
    if (value.trim().startsWith('[', 0)) {
      return JSON.parse(value);
    }
    if (value.trim().startsWith('{', 0)) {
      return JSON.parse(value);
    }
    return value;
  }

  ngOnInit(): void {
  }

  csvUploaded($event: Event) {
    // @ts-ignore
    const file = $event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (evt) => {
        this.csvToJSON(evt.target.result, (products) => {
          this.importProgress = true;
          this.stockApi.importStocks(products).then(_ => {
            this.importProgress = false;
            this.dialogRef.close(true);
            this.snack.open('Products imported', 'Ok', {
              duration: 3000
            });
          }).catch(reason => {
            this.logger.e(reason);
            this.importProgress = false;
            this.snack.open('Products not imported, try again', 'Ok', {
              duration: 3000
            });
          });
        });
      };
      fileReader.readAsText(file, 'UTF-8');
    } else {
      this.snack.open('Error while read csv', 'Ok', {
        duration: 3000
      });
    }
  }

  csvToJSON(csv, callback) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length - 1; i++) {
      const obj = {};
      const currentline = lines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        const originalValue: string = currentline[j];
        let value = originalValue.split('').map((value1, index, array) => {
          if (index === 0 && value1 === '"') {
            return '';
          }
          if (index === array.length - 1 && value1 === '"') {
            return '';
          }
          return value1;
        }).join('');
        value = ImportsDialogComponent._sanitizeField(value);
        obj[headers[j].toString().trim().split('"').join('')] = value;
      }
      result.push(obj);
    }
    if (callback && (typeof callback === 'function')) {
      return callback(result);
    }
    return result;
  }
}
