import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'smartstock-search-input',
  template: `
    <div style="width: 100%">
      <input [formControl]="searchInputControl"
             *ngIf="showSearch"
             class="toolbar-input" type="text" placeholder="{{searchPlaceholder}}">
      <mat-progress-spinner style="display: inline-block; margin-left: -30px"
                            mode="indeterminate" diameter="25"
                            color="primary"
                            *ngIf="showSearch && searchProgressFlag"
                            matSuffix>
        <!--      <mat-icon>search</mat-icon>-->
      </mat-progress-spinner>
    </div>
  `,
  styleUrls: ['../styles/search-input.style.css']
})
export class SearchInputComponent implements OnInit {
  @Input() searchInputControl: FormControl;
  @Input() showSearch = false;
  @Input() searchProgressFlag = false;
  @Input() searchPlaceholder = 'Enter something...';

  constructor() { }

  ngOnInit(): void {
  }

}
