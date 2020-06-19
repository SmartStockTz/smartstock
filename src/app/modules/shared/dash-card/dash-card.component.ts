import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {Router} from '@angular/router';

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

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  goTo() {
    if (this.reportLink) {
      this.router.navigateByUrl(this.reportLink).catch(console.log);
    }
  }
}
