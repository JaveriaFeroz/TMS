import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GridOptions } from 'ag-grid-community';
import { ReceiptService } from '../../finance/receipt/receipt.service';
import { ReceiptAllocation } from '../../finance/receipt/receiptallocation';
import { agGridHelper } from '../agGridHelper';
import { agToasterService } from '../service/toaster.service';
import { WaitDialogService } from '../waitDialog/wait-dialog.service';

@Component({
  //changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-outstandinginvoice',
  templateUrl: './outstandinginvoice.component.html',
  styleUrls: ['./outstandinginvoice.component.css']
})

export class OutstandingInvoiceComponent {
  allocData: any[];
  public goAllocation: GridOptions;
  frmAllocation: any;
  totalAmount: number;
  clientId: number;
  receiptNo: string;
  errors: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { clientId: number, receiptNo: string},
    private svcReceipt: ReceiptService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private mdAllocation: MatDialogRef<OutstandingInvoiceComponent>) {
    this.initGrid();
    this.clientId = data.clientId;
    this.receiptNo = data.receiptNo;
  }

  ngOnInit() {
    try {
      this.allocData = JSON.parse(sessionStorage.getItem("allocations"));
      if (!this.allocData || this.allocData.length == 0 && !this.receiptNo) {
        this.svcReceipt.getOSInvoices(this.clientId).subscribe(out => {
          if (out.length != 0) {
            this.allocData = out;
            this.setFooter();
          }
          else {
            this.allocData = [];
            this.svcToaster.showWarning('No oustanding Invoices found with your selected parameters or you don`t have access to this record');
          }
        },
          error => {
            this.svcToaster.showFailure(error);
          },
          () => { this.svcWaitDlg.close(); });
      }
    }
    catch (exception) { this.svcToaster.showFailure(exception, "Error Occured"); }
  }

  //#region toolbar functions
  onSubmit() {
    try {
      this.errors = [];
      var formData: ReceiptAllocation[] = this.getAllocationDataFromGrid();
      sessionStorage.removeItem("allocations");
      sessionStorage.setItem("allocations", JSON.stringify(formData));
      if (!formData.some(x => x.selected))
        this.errors.push('Atleast one Invoice must be selected before hitting ok button!');
      else if (formData.some(x => !x.selected && x.amount != 0))
        this.errors.push('Amount must be zero if invoice is not selected for knockoff!');
      else if (formData.some(x => x.selected && x.amount == 0))
        this.errors.push('Amount must be non-zero if invoice is selected for knockoff!');
      if (this.errors.length > 0) {
        alert(this.errors);
        return;
      }
      else {
        this.setFooter();
        if (this.totalAmount == 0) {
          this.errors.push('The total amount of Invoice(s) selected must be greater than zero!');
        }
        else {
          this.mdAllocation.close(this.totalAmount);
        }
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  onClose() {
    this.mdAllocation.close();
  }
  //#endregion

  //#region grid setup
  colAllocation = [
    { headerName: "Invoice #", field: "invoiceNo", width: 105},
    { headerName: "Invoice Date", field: "invoiceDate", width: 105},
    { headerName: "Client Inv #", field: "clientInvNo", width: 105},
    {
      headerName: "Invoice Amt", field: "invAmount", width: 105, valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, filter: 'agNumberColumnFilter', type: "numericColumn"
    },
    {
      headerName: "Amt Already Paid", field: "paidAmount", width: 120, valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, type: "numericColumn"
    },
    {
      headerName: "Balance Amt", field: "balAmount", width: 120, valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, type: "numericColumn"
    },
    {
      headerName: "Amount", field: "amount", width: 105, valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, type: "numericColumn", editable: true
    },
    {
      headerName: 'S', field: 'selected', width: 70,
      cellRenderer: params => {
        if (params.value) {
          return "<input type='checkbox' checked />";
        }
        else {
          return "<input type='checkbox'/>";
        }
      },
      cellEditor: agGridHelper.getCellCheckBox()
    },
  ];

  initGrid() {
    this.goAllocation = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        sortable: true,
        filter: true
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

  getAllocationDataFromGrid() {
    let rowData = [];
    this.goAllocation.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  onCellValueChanged(params) {
    if (params.column.getId() === "selected") {
      if (params.data.selected) {
        if (params.data.amount == 0) {
          params.node.setDataValue('amount', params.data.balAmount);
        }
      }
      else {
        params.node.setDataValue('amount', 0);
      }
    }
    if (params.column.getId() == 'amount') {
      if (params.data.amount != 0) {
        if (!params.data.selected)
          params.node.setDataValue('selected', true);
      }
      else if (params.data.selected) {
        params.node.setDataValue('selected', false);
      }
    }
    this.setFooter();
  }

  setFooter() {
    try {
      let totalAmount = 0;
      this.goAllocation.api.forEachNode(n => { if (n.data.selected) { totalAmount += n.data.amount } });
      this.totalAmount = totalAmount;
      this.goAllocation.api.setPinnedBottomRowData([{
        invoiceId: null, invoiceNo: null, invoiceDate: null, clientInvNo: null, invAmount: null,
        paidAmount: null, balAmount: null, amount: totalAmount, selected: null
      }]);
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };
  //#endregion
}
