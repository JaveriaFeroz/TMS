import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HistoryDialogComponent } from '../historyDialog/history-dialog.component';

@Injectable()
export class HistoryDialogService {  
  constructor(private dialog: MatDialog) { }
  dialogRef: MatDialogRef<HistoryDialogComponent>;

  public open(title: string, colDefs: {}, rowData: {}) {
    this.dialogRef = this.dialog.open(HistoryDialogComponent, {
      data: {
        header: title,
        columnDefinitions: colDefs,
        displayData: rowData
      },
      height: '90vh',
      width: '95vw',
    });
  } 

  public close() {
    this.dialogRef.close();
  }
}
