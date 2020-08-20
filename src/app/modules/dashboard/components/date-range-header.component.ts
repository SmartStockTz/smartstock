import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DateAdapter, SatCalendar, SatCalendarFooter, SatDatepicker} from 'saturn-datepicker';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import * as moment from 'moment';
import {DeviceInfo} from '../../shared/DeviceInfo';

@Component({
  selector: 'app-date-range-selector',
  template: `
    <div style="background: white">
      <div style="background: white">
        <button mat-button
                color="primary"
                style="margin: 5px"
                *ngFor="let range of ranges"
                (click)="setRange(range.key)">{{range.label}}</button>
      </div>
    </div>
  `,
  styleUrls: ['../styles/date-range-header.style.css']
})
export class DateRangeHeaderComponent<Date> extends DeviceInfo implements SatCalendarFooter<Date>, OnInit {
  public ranges: Array<{ key: string, label: string }> = [
    {key: 'today', label: 'Today'},
    {key: 'thisWeek', label: 'This Week'},
    {key: 'thisMonth', label: 'This Month'},
    {key: 'thisYear', label: 'This Year'},
  ];
  private destroyed = new Subject<void>();

  constructor(
    private calendar: SatCalendar<Date>,
    private datePicker: SatDatepicker<Date>,
    private dateAdapter: DateAdapter<Date>,
    cdr: ChangeDetectorRef
  ) {
    super();
    calendar.stateChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnInit(): void {
  }

  setRange(range: string) {
    const today = moment();
    switch (range) {
      case 'today':
        this.calendar.beginDate = this.dateAdapter.deserialize(new Date());
        this.calendar.endDate = this.dateAdapter.deserialize(new Date());
        this.calendar.activeDate = this.calendar.beginDate;
        break;
      case 'thisWeek':
        this.calendar.beginDate = this.dateAdapter.deserialize(today.weekday(0).toDate());
        this.calendar.endDate = this.dateAdapter.deserialize(today.weekday(6).toDate());
        break;
      case 'thisMonth':
        this.calendar.beginDate = this.dateAdapter.deserialize(today.startOf('month').toDate());
        this.calendar.endDate = this.dateAdapter.deserialize(today.endOf('month').toDate());
        break;
      case 'thisYear':
        this.calendar.beginDate = this.dateAdapter.deserialize(today.startOf('year').toDate());
        this.calendar.endDate = this.dateAdapter.deserialize(today.endOf('year').toDate());
        break;
    }
    this.calendar.activeDate = this.calendar.beginDate;
    this.calendar.beginDateSelectedChange.emit(this.calendar.beginDate);
    this.calendar.dateRangesChange.emit({begin: this.calendar.beginDate, end: this.calendar.endDate});
    this.datePicker.close();
  }
}
