import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-on-fetch',
  templateUrl: './on-fetch.component.html',
  styleUrls: ['./on-fetch.component.css']
})
export class OnFetchComponent implements OnInit {

  @Output() refreshCallback = new EventEmitter();
  @Input() isLoading: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  callBack() {
    this.refreshCallback.emit();
  }

}
