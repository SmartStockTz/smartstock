import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
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
