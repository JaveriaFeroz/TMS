import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: "date-cell",
  template: `
    <mat-form-field class="tb100">
      <input matInput [matDatepicker]="picker" [value]="selectedDate" (dateChange)="onDateChanged($event)" readonly/>
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>`
})

export class agGridDateEditor implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  selectedDate = null;

  @ViewChild('picker') public picker;

  agInit(params: any): void {
    this.params = params;
    if (this.params.value != null)
      this.selectedDate = this.params.value;
  }

  ngAfterViewInit() {
    this.picker.open();
  }

  getValue = () => {
    return this.selectedDate;
  };

  isPopup(): boolean {
    return true;
  }

  onDateChanged = event => {
    let date = event.value;
    if (date) {
      date.setHours(0, 0, 0, 0);
    }
    this.selectedDate = date;
    this.params.api.stopEditing();
  }
}
