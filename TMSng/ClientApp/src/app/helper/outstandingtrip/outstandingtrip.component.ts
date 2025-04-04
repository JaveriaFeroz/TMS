import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GridOptions } from 'ag-grid-community';
import { JPService } from '../../finance/jp/jp.service';
import { JPTrip } from '../../finance/jp/jptrip';
import { agGridHelper } from '../agGridHelper';
import { agToasterService } from '../service/toaster.service';
import { WaitDialogService } from '../waitDialog/wait-dialog.service';

@Component({
  selector: 'app-outstandingtrip',
  templateUrl: './outstandingtrip.component.html',
  styleUrls: ['./outstandingtrip.component.css']
})

export class OutstandingTripComponent {
  tripData: any[];
  public goTrip: GridOptions;
  frmTrip: any;
  totalAmount: number;
  clientId: number;
  voucherNo: string;
  dateFrom: Date;
  dateTo: Date;
  errors: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA)
  data: { clientId: number, voucherNo: string, dateFrom: Date, dateTo: Date },
    private formbulider: FormBuilder, private svcJP: JPService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private mdTrip: MatDialogRef<OutstandingTripComponent>) {
    this.initGrid();
    this.clientId = data.clientId;
    this.voucherNo = data.voucherNo;
    this.dateFrom = data.dateFrom;
    this.dateTo = data.dateTo;
  }

  ngOnInit() {
    try {
      this.tripData = JSON.parse(sessionStorage.getItem("trips"));
      if (!this.tripData || this.tripData.length == 0 && !this.voucherNo) {
        this.svcJP.getOSTrips(this.clientId, this.dateFrom, this.dateTo).subscribe(out => {
          if (out.length != 0) {
            this.tripData = out;
            this.setFooter();
          }
          else {
            this.tripData = [];
            this.svcToaster.showWarning('No oustanding Trips found with your selected parameters or you don`t have access to this record');
          }
        },
          error => {
            this.svcToaster.showFailure(error);
          }, () => { this.svcWaitDlg.close(); });
      }
    }
    catch (exception) { this.svcToaster.showFailure(exception, "Error Occured"); }
  }

  //#region toolbar functions
  onSubmit() {
    try {
      this.errors = [];
      var formData: JPTrip[] = this.getTripsFromGrid();
      sessionStorage.removeItem("trips");
      sessionStorage.setItem("trips", JSON.stringify(formData));
      if (!formData.some(x => x.selected))
        this.errors.push('Atleast one Trip must be selected before hitting ok button!');
      if (this.errors.length > 0) {
        alert(this.errors);
        return;
      }
      else {
        this.setFooter();
        if (this.totalAmount == 0) {
          this.errors.push('The total amount of slips selected for Invoice must be greater than zero!');
        }
        else {
          this.mdTrip.close(this.totalAmount);
        }
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  onClose() {
    this.mdTrip.close();
  }
  //#endregion toolbar functions

  //#region grid setup
  colTrip = [
    { headerName: "RWB #", field: "rwbNo", width: 105 },
    { headerName: "Job #", field: "jobNo", width: 105 },
    { headerName: "Document #", field: "clientRefNo", width: 105 },
    { headerName: "Pack Slip #", field: "packSlipNo", width: 105 },
    { headerName: "Vehicle #", field: "vehicleNo", width: 105 },
    { headerName: "Departure Date", field: "departureDate", width: 105 },
    { headerName: "Job Close Date", field: "jobCloseDate", width: 105 },    {
      headerName: "Total Expense", field: "amount", width: 125, type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
    },
    {
      headerName: 'S', field: 'selected', width: 60,
      cellRenderer: params => {
        if (params.node.isRowPinned()) {
          return null;
        }
        else if (params.value) {
          return "<input type='checkbox' checked />";
        }
        else {
          return "<input type='checkbox'/>";
        }
      },
      cellEditor: agGridHelper.getCellCheckBox()
    }
  ];

  getTripsFromGrid() {
    let rowData = [];
    this.goTrip.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  initGrid() {
    this.goTrip = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        sortable: true
      },
      rowSelection: 'single',
      onCellClicked: function (event) {
        if (event.colDef.field == "selected") {
          event.node.setDataValue('selected', !event.data.selected);
        }
      },
      overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
      overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>',
      onGridReady: () => {
        this.setFooter();
      }
    };
  }

  onSelected(params) {
    if (params.column.getId() === "selected") {
      this.setFooter();
    }
  }

  setFooter() {
    try {
      let totalAmount = 0;
      this.goTrip.api.forEachNode(n => { if (n.data.selected) { totalAmount += n.data.amount } });
      var footer = [{ rwbNo: null, amount: totalAmount, selected: null }];
      this.totalAmount = totalAmount;
      this.goTrip.api.setPinnedBottomRowData(footer);
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };
  //#endregion
}
