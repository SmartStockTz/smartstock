import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DateAdapter, SatCalendar, SatCalendarFooter, SatDatepicker} from 'saturn-datepicker';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-date-range-selector',
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.css']
})
export class DateRangeSelectorComponent<Date> implements SatCalendarFooter<Date>, OnInit {
  public ranges: Array<{ key: string, label: string }> = [
    {key: 'today', label: 'Today'},
    {key: 'thisWeek', label: 'This Week'},
  ];
  private destroyed = new Subject<void>();

  constructor(
    private calendar: SatCalendar<Date>,
    private datePicker: SatDatepicker<Date>,
    private dateAdapter: DateAdapter<Date>,
    cdr: ChangeDetectorRef
  ) {
    calendar.stateChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnInit(): void {
  }

  setRange(range: string) {
    switch (range) {
      case 'today':
        this.calendar.beginDate = this.dateAdapter.deserialize(new Date());
        this.calendar.endDate = this.dateAdapter.deserialize(new Date());
        this.calendar.activeDate = this.calendar.beginDate;
        break;
      case 'thisWeek':
        const today = moment();
        this.calendar.beginDate = this.dateAdapter.deserialize(today.weekday(0).toDate());
        this.calendar.endDate = this.dateAdapter.deserialize(today.weekday(6).toDate());
        break;
    }
    this.calendar.activeDate = this.calendar.beginDate;
    this.calendar.beginDateSelectedChange.emit(this.calendar.beginDate);
    this.calendar.dateRangesChange.emit({begin: this.calendar.beginDate, end: this.calendar.endDate});
    this.datePicker.close();
  }
}
