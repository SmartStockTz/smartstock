import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'smartstock-upload-files',
  template: `
    <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; padding: 8px">
      <div *ngFor="let file of files; let i =index"
           style="display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center">
        <mat-card style="height: 50px; margin: 5px; display: flex; flex-direction: row; align-items: center">
      <span style="max-width: 200px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
        {{file.name}}
      </span>
          <span style="width: 10px"></span>
          <button mat-icon-button style="display: inline-block" (click)="removeFile($event, i)">
            <mat-icon color="warn">delete</mat-icon>
          </button>
        </mat-card>
      </div>
      <mat-card (click)="uploadFile.click()" matRipple style="width: 120px; height: 50px; margin: 5px">
        <mat-icon>attachment</mat-icon>
        <span>Add File</span>
      </mat-card>
    </div>

    <input style="display: none" #uploadFile [multiple]="false" type="file" (change)="uploadFiles($event,uploadFile)">
  `,
  styleUrls: ['../styles/upload-files.style.css']
})
export class UploadFilesComponent implements OnInit {
  @Input() files: { name: string, type: string, url: string }[] = [];
  @Input() uploadFileFormControl: FormControl = new FormControl([], [Validators.nullValidator, Validators.required]);

  constructor() {
  }

  ngOnInit(): void {
  }

  removeFile($event: MouseEvent, i: number) {
    $event.preventDefault();
    this.files.splice(i, 1);
  }

  async uploadFiles($event: Event, uploadFile: HTMLInputElement) {
    const files: FileList = $event.target['files'];
    if (files.item(0)) {
      const file: File = files.item(0);
      if (this.files.length === 0) {
        this.files.push({
          name: file.name,
          type: file.type,
          url: await this.readFileContent(file),
        });
      } else {
        this.files = this.files.filter(value => file.name !== value.name);
        this.files.push({
          name: file.name,
          type: file.type,
          url: await this.readFileContent(file)
        });
      }
      this.uploadFileFormControl.setValue(this.files);
      uploadFile.value = '';
    }
  }

  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        resolve(ev.target.result.toString());
      };
      fileReader.onerror = _ => {
        reject('Fails to read file');
      };
      fileReader.readAsDataURL(file);
    });
  }

}
