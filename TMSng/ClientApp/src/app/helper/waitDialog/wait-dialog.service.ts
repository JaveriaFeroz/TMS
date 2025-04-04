import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WaitDialogComponent } from '../waitDialog/wait-dialog.component';

@Injectable()
export class WaitDialogService {  
  constructor(private dialog: MatDialog) { }
  dialogRef: MatDialogRef<WaitDialogComponent>;

  public open(options) {
    this.dialogRef = this.dialog.open(WaitDialogComponent, {
      //data: {
      //  title: options.title,
      //  message: options.message,
      //  cancelText: options.cancelText,
      //  confirmText: options.confirmText
      //}
      disableClose: true
    });
  }

  //public confirmed(): Observable<any> {
  //  return this.dialogRef.afterClosed().pipe(take(1), map(res => {
  //    return res;
  //  }
  //  ));
  //}

  public close() {
    this.dialogRef.close();
  }
}
