import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { map, take } from 'rxjs/operators';
import { SearchDialogComponent } from '../searchDialog/search-dialog.component';

@Injectable()
export class SearchDialogService {  
  constructor(private dialog: MatDialog) { }
  dlgSearch: MatDialogRef<SearchDialogComponent>;

  public open(title: string, colDefs: {}, rowData: {}) {
    this.dlgSearch = this.dialog.open(SearchDialogComponent, {
      data: {
        header: title,
        columnDefinitions: colDefs,
        displayData: rowData
      },
      height: '90vh',
      width: '95vw',
    });
  }

  public selected(): Observable<any> {
    return this.dlgSearch.afterClosed().pipe(take(1), map(res => { return res;}
    ));
  }

  public close() {
    if (this.dlgSearch)
      this.dlgSearch.close();
  }
}
