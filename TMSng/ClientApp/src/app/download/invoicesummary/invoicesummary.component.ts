import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { agGridHelper } from '../../helper/agGridHelper';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { InvoiceSummaryService } from './invoicesummary.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-invoicesummary',
  templateUrl: './invoicesummary.component.html',
  styleUrls: ['./invoicesummary.component.css']
})
export class InoviceSummaryComponent implements OnInit {
  public goInvoiceSummary: GridOptions;
  readonly optionName: string = 'Invoice Summary';
  model: any = {};
  frmInvoiceSummary: any;
  errors: string[] = [];
  invoiceSummaryData: any[];
  extractInvoiceSummaryData: any[];
  Date = new Date();
  MinDate = new Date();
  MaxDate = new Date();
  constructor(private router: Router, private formbulider: FormBuilder,
    private svcInvSummary: InvoiceSummaryService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
    this.initGrid();
    this.MinDate.setDate(this.Date.getDate() - 360);
  }

  ngOnInit(): void {
    this.frmInvoiceSummary = this.formbulider.group({
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]]
    });
    this.frmInvoiceSummary.patchValue({ dateFrom: new Date(), dateTo: new Date() });
    this.invoiceSummaryData = [];

  }
  //#region toolbar functions

  tbExit() {
    this.router.navigate(['/MainForm']);
  }

  tbUndo() {
    this.initForm(); 
  }

  tbLoad() {
    try {
      this.frmInvoiceSummary.markAllAsTouched();
      this.svcWaitDlg.open({});
      var formData = this.frmInvoiceSummary.getRawValue();
      if (formData.dateFrom > formData.dateTo) {
        this.svcToaster.showFailure('Please select valid date range before submitting extract request. Date From must always be lesser than or equal to Date To');
        return;
      }
      else {
        this.svcInvSummary.get(formData.dateFrom, formData.dateTo).subscribe(
          invoicesummary => {
            if (Object.keys(invoicesummary).length != 0) {             
              this.invoiceSummaryData = invoicesummary;
              this.svcWaitDlg.close();
            }         
            else {
              this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
              this.svcWaitDlg.close();
            }
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); });
      }
    }
    catch (e) { this.svcToaster.showFailure(e); this.svcWaitDlg.close(); }
  }

  tbExport() {
    try {
      this.extractInvoiceSummaryData = this.getDataFromGrid();
      if (Object.keys(this.extractInvoiceSummaryData).length > 0) {
        this.ExportDatatoExcel(this.extractInvoiceSummaryData, 'InvoiceSummary.xlsx');
      }
      else {
        this.svcToaster.showWarning('No record found with your provided key value ');
      }
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }
  //#endregion toolbar functions
  //#region local functions
  private ExportDatatoExcel(data: any[], excelFileName: string) {
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(data);
    const workbook: xlsx.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  //#region grid setup
  //#region Invoice Summary Grid Definition & functions
  colInvoiceSummary = [
    {
      headerName: "Invoice #", field: "invoiceNo", editable: false, width: 120
    },    
    {
      headerName: "Invoice Date", field: "invoiceDate", editable: false, width: 100
    },
    {
      headerName: "Id", field: "clientId", editable: false, width: 80
    },
    {
      headerName: "Name", field: "clientName", editable: false, width: 200
    },
    {
      headerName: "Gross Amt", field: "grossAmount",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    //{
    //  headerName: "Gst %", field: "gstPercentage",
    //  valueFormatter: agGridHelper.formatNumbers,
    //  valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    //},
    {
      headerName: "Gst Amt", field: "gstAmount",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Total Amt", field: "totalAmount",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Invoice Month", field: "invoiceMonth", editable: false, width: 100
    },
    {
      headerName: "Invoice From", field: "invoiceFrom", editable: false, width: 120
    },
    {
      headerName: "Invoice To", field: "invoiceTo", editable: false, width: 120
    },
    {
      headerName: "WorkFlowName", field: "workFlowName", editable: false, width: 170
    }, 
  ];

  getDataFromGrid() {
    let rowData = [];
    this.goInvoiceSummary.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  //#endregion
  initGrid() {
    this.goInvoiceSummary = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        sortable: true,
        filter: true,
        resizable: true
      },
    };
  }

  //#endregion
  private initForm() {
    //this.frmInvoiceSummary.reset();
    this.frmInvoiceSummary.patchValue({ DateFrom: new Date(), DateTo: new Date() });
    this.errors = [];
    //this.goInvoiceSummary.api.setRowData([]);
    this.invoiceSummaryData = [];
  }
  //#endregion local functions
}
