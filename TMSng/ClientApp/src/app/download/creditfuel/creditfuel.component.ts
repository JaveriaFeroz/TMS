import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { agGridHelper } from '../../helper/agGridHelper';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { CreditFuelService } from './creditfuel.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-creditfuel',
  templateUrl: './creditfuel.component.html',
  styleUrls: ['./creditfuel.component.css']

})
export class CreditFuelComponent implements OnInit {
  public goFuel: GridOptions;
  readonly optionName: string = 'Credit Fuel';
  lstSupplier: any;
  lstClient: any;
  frmCreditFuel: any;
  errors: string[] = [];
  fuelData: any[];
  extractFuelData: any[];
  MinDate = new Date();
  MaxDate = new Date();
  Date = new Date();
  constructor(private router: Router, private formbulider: FormBuilder,
    private svcCreditFuel: CreditFuelService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService) {
    this.loadLookup();
    this.initGrid();
    this.MinDate.setDate(this.Date.getDate() - 360);
  }

  ngOnInit(): void {
    this.frmCreditFuel = this.formbulider.group({
      //DateBasicId: [null, [Validators.required]],
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]],
      clientId: [null],
      supplierId: [null]
      //JobPeriod: [null],
    });
    this.frmCreditFuel.patchValue({ dateFrom: new Date(), dateTo: new Date() });
    this.fuelData = [];
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
      var formData = this.frmCreditFuel.getRawValue();
      if (formData.dateFrom > formData.dateTo) {
        this.svcToaster.showFailure('Please select valid date range before submitting extract request. Date From must always be lesser than or equal to Date To');
        return;
      }
      else {
        if (formData.clientId == null) {
          formData.clientId = 0
        }
        if (formData.supplierId == null) {
          formData.supplierId = 0
        }
        this.svcCreditFuel.get(formData.dateFrom, formData.dateTo, formData.clientId, formData.supplierId).subscribe(
          fuel => {
            if (Object.keys(fuel).length > 0) {
              this.fuelData = fuel;
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
      this.extractFuelData = this.getDataFromGrid();

      if (Object.keys(this.extractFuelData).length > 0) {
        this.ExportDatatoExcel(this.extractFuelData, 'CreditFuel.xlsx');
      }
      else {
        this.svcToaster.showWarning('No record found with your provided key value ');
      }
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }


  //#endregion toolbar functions

  //#region grid setup
  //#region CF Grid Definition & functions

  colFuel = [
    {
      headerName: "Slip #", field: "slipNo", editable: false, width: 80
    },
    {
      headerName: "Slip Date", field: "slipDate", editable: false, width: 100
    },
    {
      headerName: "Client", field: "clientName", editable: false, width: 250
    },
    {
      headerName: "Supplier", field: "supplierName", editable: false, width: 200
    },
    {
      headerName: "Job #", field: "jobNo", editable: false, width: 120
    },
    {
      headerName: "Status", field: "stateName", editable: false, width: 80
    },
    {
      headerName: "Asset #", field: "assetNo", editable: false, width: 80
    },
    {
      headerName: "Fuel Ltr", field: "litre",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 80
    },
    {
      headerName: "Amount", field: "amount",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 80
    }, 
    
  ];


  getDataFromGrid() {
    let rowData = [];
    this.goFuel.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  //#endregion
  initGrid() {
    this.goFuel = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        sortable: true,
        filter: true,
        resizable:true
      },
      onRowDataChanged: () => { this.setFooter(); },
      overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
      overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>',
      };
  }

  //#endregion

  //#region local functions'
  private setFooter() {
    try {
      let _qty = 0, _amount = 0;
      this.goFuel.api.forEachNode(function (rowNode, index) {
        if (rowNode.data.slipNo != undefined) { _qty += rowNode.data.litre, _amount += rowNode.data.amount }
      });
      this.goFuel.api.setPinnedBottomRowData([{
        slipNo: null, slipDate: null, clientName: null, supplierName: null, jobNo: null, stateName: null, assetNo: null,
        litre: _qty, amount: _amount
      }]);
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };
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

  private loadLookup() {
    try {
      this.svcCreditFuel.getLookup().subscribe(
        data => {
          this.lstClient = data.lstClient;
          this.lstSupplier = data.lstSupplier;
        },
        error => {
          this.svcToaster.showFailure(error);
        }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }
  private initForm() {
    this.frmCreditFuel.reset();
    this.frmCreditFuel.patchValue({ dateFrom: new Date(), dateTo: new Date() });
    this.errors = [];
    this.fuelData = [];
  }
  //#endregion local functions


}
