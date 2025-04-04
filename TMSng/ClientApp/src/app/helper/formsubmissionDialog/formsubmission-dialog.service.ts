import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { map, take } from 'rxjs/operators';
import { FormSubmissionDialogComponent } from '../formsubmissionDialog/formsubmission-dialog.component';

@Injectable()
export class FormSubmissionDialogService {  
  constructor(private dialog: MatDialog) { }
  dialogRef: MatDialogRef<FormSubmissionDialogComponent>;

  public open(title: string, status: string, listData: {}) {
    this.dialogRef = this.dialog.open(FormSubmissionDialogComponent, {
      data: {
        header: title,
        DocumentStatus: status,
        Recipients: listData,
        recipientId: listData[0].recipientId
      },
      width: '575px',
      height: '375px',  
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
