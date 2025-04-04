import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { agFormHelper } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ShortageService } from './shortage.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-shortage',
  templateUrl: './shortage.component.html',
  styleUrls: ['./shortage.component.css']
})
export class ShortageComponent implements OnInit {
  public goShortage: GridOptions;
  readonly optionName: string = 'Shortage';
/*  model: any = {};*/
  lstPeriod: any;
  lstAsset: any;
  lstClient: any;
  frmShortage: any;
  errors: string[] = [];
  shortageData: any[];
  extractShoratageData: any[];
  periodfrom: number;
  periodto: number;
  constructor(private router: Router, private formbulider: FormBuilder,
    private svcShortage: ShortageService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
    this.loadLookup();
    this.initGrid();
    this.periodfrom = agFormHelper.opsPeriodId();
    this.periodto = this.periodfrom;
  }

  ngOnInit(): void {
    this.frmShortage = this.formbulider.group({
      //DateBasicId: [null, [Validators.required]],
      periodFrom: [null, [Validators.required]],
      periodTo: [null, [Validators.required]],
      clientId: [null],
      assetId: [null]
      //JobPeriod: [null],
    });
    
    this.frmShortage.patchValue({ periodFrom: this.periodfrom, periodTo: this.periodto  });
    this.shortageData = [];
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
      const formData = this.frmShortage.getRawValue();
      if (formData.periodFrom > formData.periodTo) {
        this.svcToaster.showFailure('Please select valid date range before submitting extract request. Period From must always be lesser than or equal to Period To');
        return;
      }
      else {
        if (formData.clientId == null) {        
          formData.clientId = 0
        }
        if (formData.assetId == null) {         
          formData.assetId = 0
        }
        this.svcShortage.get(formData.periodFrom, formData.periodTo, formData.clientId, formData.assetId).subscribe(
          shortageData => {
            if (Object.keys(shortageData).length > 0) {
          this.shortageData = shortageData;
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
      this.extractShoratageData = this.getDataFromGrid();
      if (Object.keys(this.extractShoratageData).length > 0) {
        this.ExportDatatoExcel(this.extractShoratageData, 'Shortage.xlsx');
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

  colShortage = [
    {
      headerName: "Job #", field: "jobNo", editable: false, width: 100
    },
    {
      headerName: "Rwb #", field: "rwbNo", editable: false, width: 100
    },
    {
      headerName: "Jo Date", field: "jobCloseDate", editable: false, width: 100
    },
    {
      headerName: "Period", field: "period", editable: false, width: 100
    },  
    {
      headerName: "Order #", field: "customerOrderNo", editable: false, width: 100
    },
    {
      headerName: "Gate Pas #", field: "gatePassNo", editable: false, width: 100
    },
    {
      headerName: "Asset #", field: "assetNo", editable: false, width: 100
    },
    {
      headerName: "capacity", field: "capacityName", editable: false, width: 100
    },
    {
      headerName: "Shipper", field: "shipperName", editable: false, width: 150
    },
    {
      headerName: "Consignee", field: "consigneeName", editable: false, width: 180
    },  
    {
      headerName: "Qty", field: "shortageQuantity",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 80
    },
    {
      headerName: "Amount", field: "shortageAmount",
      valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 80
    },
  ];

  getDataFromGrid() {
    let rowData = [];
    this.goShortage.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  //#endregion
  initGrid() {
    this.goShortage = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      ////columnDefs: this.colShortage,
      ////rowData: [],
      //rowSelection: 'single',
      //rowDeselection: true,
      //floatingFilter: true,
      //enableColResize: true,
      //singleClickEdit: false,
      //suppressCellSelection: false,
      //overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
      //overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'     
    };
  }

  //#endregion

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

  private loadLookup() {
    try {
      this.svcShortage.getLookup().subscribe(
        data => {
          this.lstClient = data.lstClient;
          this.lstAsset = data.lstAsset.filter(x => x.assetTypeId === 1);
          this.lstPeriod = data.lstPeriod;
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
    this.frmShortage.reset();
    this.errors = [];
    this.frmShortage.patchValue({ periodFrom: this.periodfrom, periodTo: this.periodto });
    this.extractShoratageData = [];
    this.shortageData = [];
  }
  //#endregion local functions
}
