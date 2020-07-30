import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StockDatabaseService} from '../../../services/stock-database.service';
import {LogService} from '../../../services/log.service';

@Component({
  selector: 'app-upload-products',
  templateUrl: './upload-products.component.html',
  styleUrls: ['./upload-products.component.css']
})
export class UploadProductsComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<UploadProductsComponent>,
              private snack: MatSnackBar,
              private readonly logger: LogService,
              private readonly stockApi: StockDatabaseService) {
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
        value = UploadProductsComponent._sanitizeField(value);
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
