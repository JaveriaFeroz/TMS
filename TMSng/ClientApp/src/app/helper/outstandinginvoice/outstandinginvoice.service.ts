import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { OutstandingInvoiceComponent } from '../outstandinginvoice/outstandinginvoice.component';

@Injectable()
export class OutstandingInvoiceService {
  constructor(private dialog: MatDialog) { }
  dialogRef: MatDialogRef<OutstandingInvoiceComponent>;

  public open(clientId: number, receiptNo: string) {
    this.dialogRef = this.dialog.open(OutstandingInvoiceComponent, {
      data: {
        clientId: clientId,
        receiptNo: receiptNo
      },
      height: '80vh',
      width: '74vw',
      disableClose: true
    });
  }

  public selected(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(take(1), map(res => { return res; }
    ));
  }

  public close() {
    this.dialogRef.close();
  }
}
