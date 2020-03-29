import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {StockDatabaseService} from '../../services/stock-database.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-products',
  templateUrl: './upload-products.component.html',
  styleUrls: ['./upload-products.component.css']
})
export class UploadProductsComponent implements OnInit {
  importProgress = false;

  constructor(private dialogRef: MatDialogRef<UploadProductsComponent>,
              private snack: MatSnackBar,
              private readonly stockApi: StockDatabaseService) {
  }

  ngOnInit(): void {
  }

  csvUploaded($event: Event) {
    // @ts-ignore
    const file = $event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (evt) => {
        console.log(evt.target.result);
        console.log(this.csvToJSON(evt.target.result, null));
      };
      fileReader.readAsText(file, 'UTF-8');
    } else {
      this.snack.open('Error while read csv');
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
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    if (callback && (typeof callback === 'function')) {
      return callback(result);
    }
    return result;
  }

}
