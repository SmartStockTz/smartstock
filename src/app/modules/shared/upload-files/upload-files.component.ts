import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
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
