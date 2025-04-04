import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GridOptions } from 'ag-grid-community';
import { APInvoiceService } from '../../finance/invoiceap/apinvoice.service';
import { APInvoiceSlip } from '../../finance/invoiceap/apinvoiceslip';
import { agGridHelper } from '../agGridHelper';
import { agToasterService } from '../service/toaster.service';
import { WaitDialogService } from '../waitDialog/wait-dialog.service';

@Component({
  selector: 'app-outstandingslip',
  templateUrl: './outstandingslip.component.html',
  styleUrls: ['./outstandingslip.component.css']
})

export class OutstandingSlipComponent {
  slipData: any[];
  public goSlip: GridOptions;
  frmSlip: any; 
  totalAmount: number;
  supplierId: number;
  pivNo: string;
  dateFrom: Date;
  dateTo: Date;
  errors: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA)
    data: { supplierId: number, pivNo: string, dateFrom: Date, dateTo: Date }, //private formbulider: FormBuilder,
    private svcPIV: APInvoiceService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private mdSlip: MatDialogRef<OutstandingSlipComponent>) {
    this.initGrid();
    this.supplierId = data.supplierId;
    this.pivNo = data.pivNo;
    this.dateFrom = data.dateFrom;
    this.dateTo = data.dateTo;
  }

  ngOnInit() {
    try {
      this.slipData = JSON.parse(sessionStorage.getItem("slips"));
      if (!this.slipData || this.slipData.length == 0 && !this.pivNo) {
        this.svcPIV.getOSSlips(this.supplierId, this.dateFrom, this.dateTo).subscribe(out => {
          if (out.length != 0) {
            this.slipData = out;
            this.setFooter();
          }
          else {
            this.slipData = [];
            this.svcToaster.showWarning('No oustanding fuel slip found with your selected parameters or you don`t have access to this record');
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
      var formData: APInvoiceSlip[] = this.getSlipsFromGrid();
      sessionStorage.removeItem("slips");
      sessionStorage.setItem("slips", JSON.stringify(formData));
      if (!formData.some(x => x.selected))
        this.errors.push('Atleast one slip must be selected before hitting ok button!');
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
          this.mdSlip.close(this.totalAmount);
        }
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  onClose() {
    this.mdSlip.close();
  }
  //#endregion toolbar functions    

  //#region grid setup
  colSlip = [
    { headerName: "Slip #", field: "slipNo", width: 135},
    { headerName: "Slip Date", field: "slipDate", width: 105},
    {
      headerName: "Fuel Litre ", field: "qty", width: 105, type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
    },
    {
      headerName: "Amount", field: "amount", width: 125, type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
    },
    {
      headerName: 'S', field: 'selected', width: 70, 
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

  private getSlipsFromGrid() {
    let rowData = [];
    this.goSlip.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  private initGrid() {
    this.goSlip = <GridOptions>{
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
  //#endregion

  onSelected(params) {
    if (params.column.getId() === "selected") {
      this.setFooter();
    }
  }

  setFooter() {
    try {
      let totalAmount = 0, totalQty = 0;
      this.goSlip.api.forEachNode(n => { if (n.data.selected) { totalAmount += n.data.amount, totalQty += n.data.qty; } });
      var footer = [{ slipNo: null, slipDate: null, qty: totalQty, amount: totalAmount, selected: null }];
      this.totalAmount = totalAmount;
      this.goSlip.api.setPinnedBottomRowData(footer);
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };
}
