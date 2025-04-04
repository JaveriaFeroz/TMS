import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { map, take } from 'rxjs/operators';
import { agFormHelper } from '../agFormHelper';
import { OutstandingTripComponent } from '../outstandingtrip/outstandingtrip.component';

@Injectable()
export class OutstandingTripService {  
  constructor(private dialog: MatDialog) { }
  dialogRef: MatDialogRef<OutstandingTripComponent>;

  public open(clientId: number, voucherNo: string, dateFrom: Date, dateTo: Date) {
    this.dialogRef = this.dialog.open(OutstandingTripComponent, {
      data: {
        clientId: clientId,
        voucherNo: voucherNo,
        dateFrom: agFormHelper.getISODate(dateFrom),
        dateTo: agFormHelper.getISODate(dateTo)
      },
      height: '80vh',
      width: '74vw',
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
