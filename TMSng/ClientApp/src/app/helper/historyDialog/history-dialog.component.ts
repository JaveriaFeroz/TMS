import { GridOptions } from 'ag-grid-community';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  //changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryDialogComponent {
  public gridHistory: GridOptions;
  private columnDefs;
  private rowData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    header: string, columnDefinitions: {}, displayData: {}},
    private mdDialogRef: MatDialogRef<HistoryDialogComponent>) {

    this.gridHistory = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      multiSortKey: 'ctrl',
      rowSelection: 'single',
      suppressCellSelection: true,
      suppressPaginationPanel: true,
      suppressHorizontalScroll: false,
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        editable: false
      },
      onGridReady: () => {
        this.gridHistory.api.sizeColumnsToFit();
      },
      overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
      overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'
    };

    this.columnDefs = data.columnDefinitions;
    this.rowData = data.displayData;
  }

  //onRowSelected(event) {
  //  if (event.node.selected) {
  //    this.mdDialogRef.close(event.node.data);
  //  }
  //}

  //public cancel() {
  //  this.close(false);
  //}

  //public close(value) {
  //  this.mdDialogRef.close(value);
  //}

  //public confirm() {
  //  this.close(true);
  //}

  //@HostListener("keydown.esc")
  //public onEsc() {
  //  this.close(false);
  //}
}
