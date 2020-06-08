import {Component, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'app-dash-card',
  templateUrl: './dash-card.component.html',
  styleUrls: ['./dash-card.component.css']
})
export class DashCardComponent implements OnInit {
  @Input() title = '';
  @Input() height = 300;
  @Input() description = '';
  @Input() reportLink: string;
  @Input() content: TemplateRef<any>;

  constructor() {
  }

  ngOnInit(): void {
  }

}
