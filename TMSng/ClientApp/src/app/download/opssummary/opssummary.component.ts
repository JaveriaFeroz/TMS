import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { agGridHelper } from '../../helper/agGridHelper';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { OPSSummaryService } from './opssummary.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-opssummary',
  templateUrl: './opssummary.component.html',
  styleUrls: ['./opssummary.component.css']
})

export class OpsSummaryComponent implements OnInit {
  public goOperational: GridOptions;
  readonly optionName: string = 'Operational MIS Data Extract';
  //model: any = {};
  frmOperational: any;
  //errors: string[] = [];
  operationalData: any[];
  extractOperationalData: any[];
  MinDate = new Date();
  MaxDate = new Date();
  Date = new Date();

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcOpsReport: OPSSummaryService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
    this.initGrid();
    this.MinDate.setDate(this.Date.getDate() - 360);
  }

  ngOnInit(): void {
    this.frmOperational = this.formbulider.group({
      //DateBasicId: [null, [Validators.required]],
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]]
      //JobPeriod: [null, [Validators.required]],    
    });
    this.frmOperational.patchValue({ dateFrom: new Date(), dateTo: new Date() });
    this.operationalData = [];
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
      this.frmOperational.markAllAsTouched();
      this.svcWaitDlg.open({});
      var formData = this.frmOperational.getRawValue();
      if (formData.dateFrom > formData.dateTo) {
        this.svcToaster.showFailure('Please select valid date range before submitting extract request. Date From must always be lesser than or equal to Date To');
        this.svcWaitDlg.close();
        return;
      }
      else {
        this.svcOpsReport.get(formData.dateFrom, formData.dateTo).subscribe(
          operationalData => {
            if (Object.keys(operationalData).length > 0) {
              this.operationalData = operationalData;
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
    catch (e) { this.svcToaster.showFailure(e); }
  }

  tbExport() {
    try {
      this.extractOperationalData = this.getDataFromGrid();
      if (Object.keys(this.extractOperationalData).length > 0) {
        this.ExportDatatoExcel(this.extractOperationalData, 'OperationalData.xlsx');
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
  //#region OP Grid Definition & functions
  colOperational = [
    {
      headerName: "Job#", field: "jobNo", editable: false, width: 100
    },    
    {
      headerName: "Rwb#", field: "rwbNo", editable: false, width: 100
    },
    {
      headerName: "RWBDate", field: "rwbDate", editable: false, width: 100
    },
    {
      headerName: "ConsigName", field: "consigneeName", editable: false, width: 100
    },
    {
      headerName: "CustOrder", field: "shipperRefNo", editable: false, width: 100
    },
    {
      headerName: "CategoryName", field: "categoryName", editable: false, width: 100
    },
    {
      headerName: "InvoiceNo", field: "invoiceNo", editable: false
    },
    {
      headerName: "AssetNo", field: "assetNo", editable: false, width: 100
    },
    {
      headerName: "Trailer#", field: "trailerNo", editable: false, width: 100
    },
    {
      headerName: "Route", field: "routeName", editable: false, width: 100
    },
    {
      headerName: "Capacity", field: "capacityName", editable: false, width: 100
    },
    {
      headerName: "LeaseType", field: "leaseTypeName", editable: false, width: 100
    },
    {
      headerName: "Client", field: "clientName", editable: false, width: 100
    },
    {
      headerName: "ClientRef#", field: "shipperRefNo2", editable: false, width: 100
    },
    {
      headerName: "Driver1 ", field: "driver1Name", editable: false, width: 100
    },
    {
      headerName: "Driver2", field: "driver2Name", editable: false, width: 100
    },
    {
      headerName: "Tonnage", field: "weight", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "ClientInv #", field: "clientInvoiceNo", editable: false, width: 100
    },
    {
      headerName: "Ship#", field: "shipmentNo", editable: false, width: 100
    },
    {
      headerName: "OBD#", field: "deliveryNo", editable: false, width: 100
    },
    {
      headerName: "KMs", field: "kMs", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },    
    {
      headerName: "StdKms", field: "standardKMs", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    
    {
      headerName: "KMPerLtr", field: "kmperLitre", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "FuelPerKM", field: "fuelPerKM", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Departure ", field: "departureDateTime", editable: false, width: 130
    },
    {
      headerName: "DptFromBase", field: "baseDepartureDateTime", editable: false, width: 130
    },
    {
      headerName: "ArrivalAtDestination", field: "destArrivalDateTime", editable: false, width: 130
    },
    {
      headerName: "ArrivalAtClient", field: "arrivalDateTime", editable: false, width: 130
    },
    {
      headerName: "Delivery", field: "deliveryDateTime", editable: false, width: 130
    },

    {
      headerName: "RwbStatus", field: "rwbStatusName", editable: false, width: 100
    },
    {
      headerName: "TotalExpense", field: "totalExpense", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },    
    {
      headerName: "TollTax", field: "tollTax", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Food", field: "food", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "DriverIncentive", field: "driverIncentive", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 120
    },
    {
      headerName: "Misc", field: "miscellaneous", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "UnReceipted", field: "unReceipted", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Fuel", field: "fuel", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "OutSourcedVehicle", field: "outSourcedVehicle", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Penalty", field: "penalty", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Loading", field: "loading", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "Offloading", field: "offloading", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 100
    },
    {
      headerName: "OnRouteMaint", field: "onRouteMaintainance", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 120
    },
    {
      headerName: "HSSEIncentive", field: "hsseIncentive", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 120
    },
    {
      headerName: "OutsourceDet", field: "outsourceDetention", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 120
    },
  ];


  getDataFromGrid() {
    let rowData = [];
    this.goOperational.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  //#endregion
  initGrid() {
    this.goOperational = <GridOptions>{
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
    this.frmOperational.reset();
    this.frmOperational.patchValue({ dateFrom: new Date(), dateTo: new Date() });
    //this.errors = [];
    this.operationalData = [];
    this.extractOperationalData = [];

  }
  //#endregion local functions


}
