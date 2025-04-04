import { ICellEditorAngularComp } from 'ag-grid-angular';
import { formatDate } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "time-cell",
  template: `
  <mat-form-field>         
          <input type="datetime-local"  matInput  [value]="selectedDate" 
        (dateChange)="onDateChanged($event)" >          
        </mat-form-field>  `
})

export class agGridTimeEditor implements ICellEditorAngularComp {
  private params: any;
  selectedDate = null;

  agInit(params: any): void {
    this.params = params;
  }

  getValue = () => {
    let dateString = null;
    if (this.selectedDate) {
      dateString = formatDate(this.selectedDate, 'dd/MM/yyyy', 'en-US');
      //dateString = format(this.selectedDate, "dd/MM/yyyy");
    }
    return dateString;
  };

  afterGuiAttached = () => {
    if (!this.params.value) {
      return;
    }
    const [_, day, month, year] = this.params.value.match(
      /^(\d{2})\/(\d{2})\/(\d{4})$/
    );
    let selectedDate = new Date(year, month - 1, day);

    this.selectedDate = selectedDate;
  };

  onDateChanged = event => {
    let date = event.value;
    if (date) {
            date.setHours(0, 0, 0, 0);
        }
        this.selectedDate = date;
  }
}
