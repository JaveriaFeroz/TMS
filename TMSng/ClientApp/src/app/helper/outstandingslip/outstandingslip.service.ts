import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { map, take } from 'rxjs/operators';
import { agFormHelper } from '../agFormHelper';
import { OutstandingSlipComponent } from '../outstandingslip/outstandingslip.component';

@Injectable()
export class OutstandingSlipService {  
  constructor(private dialog: MatDialog) { }
  dialogRef: MatDialogRef<OutstandingSlipComponent>;
  public open(supplierId: number, pivNo: string, dateFrom: Date, dateTo: Date) {
    this.dialogRef = this.dialog.open(OutstandingSlipComponent, {
      data: {
        supplierId: supplierId,
        pivNo: pivNo,
        dateFrom: agFormHelper.getISODate(dateFrom),
        dateTo: agFormHelper.getISODate(dateTo)
      },
      height: '80vh',
      width: '45vw',
    });
  }

  public selected(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(take(1), map(res => { return res;}
    ));
  }

  public close() {
    this.dialogRef.close();
  }
}
