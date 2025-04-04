import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { agGridHelper } from '../../helper/agGridHelper';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ExpenseSummaryService } from './expensesummary.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-expensesummary',
  templateUrl: './expensesummary.component.html',
  styleUrls: ['./expensesummary.component.css']

})
export class ExpenseSummaryComponent implements OnInit {
  public goExpenseSummary: GridOptions;
  readonly optionName: string = 'Expense Summary Data Extract';
  model: any = {};
  frmExpenseSummary: any;
  errors: string[] = [];
  expensesummaryData: any[];
  extractExpenseSummaryData: any[];
  MinDate = new Date();
  MaxDate = new Date();
  Date = new Date();

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcExpSummary: ExpenseSummaryService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
    this.initGrid();
    this.MinDate.setDate(this.Date.getDate() - 360);
  }

  ngOnInit(): void {
    this.frmExpenseSummary = this.formbulider.group({
      dateBasicId: ["0", [Validators.required]],
      dateFrom: [null],
      dateTo: [null],
    });
    this.expensesummaryData = [];
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
      var formData = this.frmExpenseSummary.getRawValue();
      if (formData.dateBasisId == null) {
        this.svcToaster.showFailure('Please select valid Date Basis for date before submitting query for data extraction');
        return;
      }
      else if (formData.dateFrom > formData.dateTo) {
        this.svcToaster.showFailure('Please select valid date range before submitting extract request. Date From must always be lesser than or equal to Date To');
        return;
      }
      else {
        this.svcExpSummary.get(formData.dateFrom, formData.dateTo, formData.dateBasisId).subscribe(
          expensesummary => {
            if (Object.keys(expensesummary).length > 0 ) {
              this.expensesummaryData = expensesummary;
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
      this.extractExpenseSummaryData = this.getDataFromGrid();

      if (Object.keys(this.extractExpenseSummaryData).length > 0) {
        this.ExportDatatoExcel(this.extractExpenseSummaryData, 'ExpenseSummary.xlsx');
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
  //#region PL Grid Definition & functions

  colExpenseSummary = [
    {
      headerName: "JobOrder#", field: "jobNo", editable: false, width: 100
    },
    {
      headerName: "Rwb#", field: "rwbNo", editable: false, width: 100
    },
    {
      headerName: "RWBDate", field: "rwbDate", editable: false, width: 100
    },
    {
      headerName: "DepartureDate", field: "departureDate", editable: false, width: 100
    },
    {
      headerName: "DeliveryDate", field: "deliveryDate", editable: false, width: 100
    },
    {
      headerName: "JobCompletionDate", field: "jobCompletionDate", editable: false, width: 100
    },
    {
      headerName: "JobStatus", field: "statusName", editable: false, width: 100
    },
    {
      headerName: "TripType", field: "tripType", editable: false, width: 100
    },
    {
      headerName: "CustomerOrderNo", field: "customerOrderNo", editable: false, width: 100
    },
    {
      headerName: "GatePassNo", field: "gatePassNo", editable: false, width: 100
    },
    {
      headerName: "VehicleType", field: "capacityName", editable: false, width: 100
    },            
    {
      headerName: "Asset", field: "assetNo", editable: false, width: 100
    },
    {
      headerName: "Client", field: "clientName", editable: false, width: 100
    },
    {
      headerName: "ShipperName", field: "shipperName", editable: false, width: 100
    },
    {
      headerName: "ConsigneeName", field: "consigneeName", editable: false, width: 100
    },
    {
      headerName: "ActualDuration ", field: "tripDuration", type: "numericColumn", editable: false, width: 100
    },
    {
      headerName: "JobStartKms ", field: "jobStartKms", type: "numericColumn", editable: false, width: 100
    },
    {
      headerName: "JobEndKms ", field: "jobEndKms", type: "numericColumn", editable: false, width: 100
    },
    {
      headerName: "JobEndKmsPerKM ", field: "jobEndKmsPerKM", type: "numericColumn", editable: false, width: 100
    },
    {
      headerName: "FuelAvgPerKm  ", field: "fuelAvgPerKm", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "FuelPerKm  ", field: "fuelPerKm", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "FuelLitre   ", field: "fuelLtrs", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },

    {
      headerName: "TollTax", field: "tollTax", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Food", field: "food", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "DriverIncentive", field: "driverIncentive", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 130
    },
    {
      headerName: "Misc", field: "miscellaneous", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "UnReceipted", field: "unReceipted", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 130
    },
    {
      headerName: "OutSourcedVehicle", field: "outSourcedVehicle", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 130
    },   
    {
      headerName: "Loading", field: "loading", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "RepairAndMaintenance", field: "repairAndMaintenance", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 130
    },
    {
      headerName: "WeighBridgeCharges", field: "weighBridgeCharges", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 130
    },
    {
      headerName: "DriverSpecialIncentive", field: "driverSpecialIncentive", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 130
    },

    {
      headerName: "CashFuel", field: "cashFuel", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },

    {
      headerName: "CreditFuel", field: "creditFuel", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "TotalTripExpenseByCash", field: "totalTripExpenseByCash", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "ExpenseAmount ", field: "expenseAmount", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },

    {
      headerName: "IsDisbursed", field: "isDisbursed", editable: false, width: 130
    },
  ];


  getDataFromGrid() {
    let rowData = [];
    this.goExpenseSummary.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  //#endregion
  initGrid() {
    this.goExpenseSummary = <GridOptions>{
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
    this.frmExpenseSummary.reset();
    this.frmExpenseSummary.patchValue({ dateBasicId: "0" });
    this.errors = [];
    this.extractExpenseSummaryData = [];
    this.expensesummaryData = [];
  }
  //#endregion local functions

}
