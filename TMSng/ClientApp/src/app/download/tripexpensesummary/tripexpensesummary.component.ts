import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { agGridHelper } from '../../helper/agGridHelper';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { TESummaryService } from './tripexpensesummary.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-tripexpensesummary',
  templateUrl: './tripexpensesummary.component.html',
  styleUrls: ['./tripexpensesummary.component.css']

})
export class TripExpenseSummaryComponent implements OnInit {
  public goTripExpense: GridOptions;
  readonly optionName: string = 'Trip Expense Data Extract';
  model: any = {};
  frmTripExpense: any;
  errors: string[] = [];
  tripExpenseData: any[];
  extractTripExpenseData: any[];
  MinDate = new Date();
  MaxDate = new Date();
  Date = new Date();

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcTripExpense: TESummaryService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
    this.initGrid();
    this.MinDate.setDate(this.Date.getDate() - 360);
  }

  ngOnInit(): void {
    this.frmTripExpense = this.formbulider.group({     
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]]
    });
    this.frmTripExpense.patchValue({ dateFrom: new Date(), dateTo: new Date() });
    this.tripExpenseData = [];
  }
  //#region toolbar functions
  tbExit() {
    this.router.navigate(['/MainForm']);
  }

  tbUndo() {
    this.initForm();
  }

  tbLoad() {
    this.svcWaitDlg.open({});
    try {
      var formData = this.frmTripExpense.getRawValue();
      if (formData.dateFrom > formData.dateTo) {
        this.svcToaster.showFailure('Please select valid date range before submitting extract request. Date From must always be lesser than or equal to Date To');
        return;
      }
      else {
        this.svcTripExpense.get(formData.dateFrom, formData.dateTo).subscribe(
          tripexpense => {
            if (Object.keys(tripexpense).length > 0) {
              this.tripExpenseData = tripexpense;
            }
            else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); });
      }
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  tbExport() {
    try {
      this.extractTripExpenseData = this.getDataFromGrid();

      if (Object.keys(this.extractTripExpenseData).length > 0) {
        this.ExportDatatoExcel(this.extractTripExpenseData, 'TripExpense.xlsx');
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
  //#region Trip Expense Grid Definition & functions

  colTripExpense = [
    {
      headerName: "Job #", field: "jobNo", editable: false, width: 100
    },
    {
      headerName: "StartDate ", field: "jobStartDate", editable: false, width: 100
    },
    {
      headerName: "EndDate ", field: "jobEndDate", editable: false, width: 100
    },
    {
      headerName: "Rwb #", field: "rwbNo", editable: false, width: 100
    },
    {
      headerName: "RWBDate", field: "rwbDate", editable: false, width: 100
    },   
    {
      headerName: "Invoice#", field: "invoiceNo", editable: false, width: 100
    },
    {
      headerName: "KMs", field: "kMs",  valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Fuel Ltrs ", field: "fuelLtrs", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },

    {
      headerName: "Dept", field: "departure", editable: false, width: 140
    },
    {
      headerName: "DeptFromBase", field: "baseDepartureDateTime", editable: false, width: 140
    },
    {
      headerName: "Arrival", field: "arrivalDateTime", editable: false, width: 140
    },
    {
      headerName: "Delivery", field: "deliveryDateTime", editable: false, width: 140
    },   
    {
      headerName: "Route", field: "routeName", editable: false, width: 100
    },   
    {
      headerName: "Client", field: "clientName", editable: false, width: 100
    },    
    {
      headerName: "TripRevenue", field: "tripRevenue", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 120
    },
    {
      headerName: "TollTax", field: "tollTax", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Food", field: "food", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "DriverIncentive", field: "driverIncentive", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 130
    },
    {
      headerName: "Misc", field: "miscellaneous", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "UnReceipted", field: "unReceipted", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Fuel", field: "fuel", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "OutSourcedVehicle", field: "outSourcedVehicle", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 130
    },
    {
      headerName: "Penalty", field: "penalty", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Loading", field: "loading", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Offloading", field: "offloading", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "OnRouteMaintainance", field: "onRouteMaintainance", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 130
    },
    {
      headerName: "HSSEIncentive", field: "hsseIncentive", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 130
    },
    {
      headerName: "OutsourceDetention", field: "outsourceDetention", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 130
    },
    {
      headerName: "Expense Amt ", field: "totalCost", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 120
    },
  ];


  getDataFromGrid() {
    let rowData = [];
    this.goTripExpense.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  //#endregion
  initGrid() {
    this.goTripExpense = <GridOptions>{
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
    this.frmTripExpense.reset();
    this.frmTripExpense.patchValue({ dateFrom: new Date(), dateTo: new Date() });
    this.errors = [];
    this.tripExpenseData = [];
    this.extractTripExpenseData = [];
  }

  //#endregion local functions


}
