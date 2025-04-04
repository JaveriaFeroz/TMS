import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { map, take } from 'rxjs/operators';
import { OutstandingPIVComponent } from '../outstandingpiv/outstandingpiv.component';

@Injectable()
export class OutstandingPIVService {
  constructor(private dialog: MatDialog) { }
  dialogRef: MatDialogRef<OutstandingPIVComponent>;

  public open(supplierId: number, pyNo: string) {
    this.dialogRef = this.dialog.open(OutstandingPIVComponent, {
      data: {
        supplierId: supplierId,
        pyNo: pyNo
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
