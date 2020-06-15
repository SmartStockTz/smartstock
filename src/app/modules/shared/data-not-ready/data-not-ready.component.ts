import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-data-not-ready',
  templateUrl: './data-not-ready.component.html',
  styleUrls: ['./data-not-ready.component.css']
})
export class DataNotReadyComponent implements OnInit {
  @Input() width = 200;
  @Input() height = 200;
  @Input() isLoading = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
