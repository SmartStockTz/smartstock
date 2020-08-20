import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-tabular-report',
  templateUrl: './tabular-report.component.html',
  styleUrls: ['./tabular-report.component.css']
})
export class TabularReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
