import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { agGridHelper } from '../../helper/agGridHelper';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { SupplierAgingService } from './supplieraging.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-supplieraging',
  templateUrl: './supplieraging.component.html',
  styleUrls: ['./supplieraging.component.css']
})

export class SupplierAgingComponent implements OnInit {
  public goSupplierAging: GridOptions;
  readonly optionName: string = 'Supplier Aging';
  model: any = {}; 
  frmSupplierAging: any;
  errors: string[] = [];
  supplierAgingData: any[];
  extractSupplierAgingData: any[];
  MinDate = new Date(new Date(new Date().getDate() - 30));
  MaxDate = new Date();

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcSupplierAging: SupplierAgingService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
    this.initGrid();
  }

  ngOnInit(): void {
    this.frmSupplierAging = this.formbulider.group({     
      dateUpto: [null, [Validators.required]],
    });
    this.frmSupplierAging.patchValue({ dateUpto: new Date() });
    this.supplierAgingData = [];
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
      const form = this.frmSupplierAging.getRawValue();
      this.svcSupplierAging.get(form.dateUpto).subscribe(
          supplieraging => {
          if (Object.keys(supplieraging).length > 0 ) {
            this.supplierAgingData = supplieraging;
            }
            else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); });
      }
    
    catch (e) { this.svcToaster.showFailure(e); }
  }

  tbExport() {
    try {
      this.extractSupplierAgingData = this.getDataFromGrid();

      if (Object.keys(this.extractSupplierAgingData).length > 0) {
        this.ExportDatatoExcel(this.extractSupplierAgingData, 'SupplierAging.xlsx');
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

  colSupplierAging = [
    {
      headerName: "Supplier", field: "supplierName", editable: false, width: 200
    },
    {
      headerName: "Credit Days", field: "creditDays", editable: false, width: 100
    },
    {
      headerName: "Not Yet Due", field: "notYetdue", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 120
    },
    {
      headerName: "OverDue1To15", field: "overDue1To15", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 120
    },
    {
      headerName: "OverDue16To30", field: "overDue16To30", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 120
    },
    {
      headerName: "OverDue31To60", field: "overDue31To60", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 120
    },
    {
      headerName: "OverDue61To90", field: "overDue61To90", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 120
    },
    {
      headerName: "OverDue91To120", field: "overDue91To120", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 120
    },
    {
      headerName: "OverDueAbove120", field: "overDueAbove120", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, editable: false, width: 130
    },
  ];


  getDataFromGrid() {
    let rowData = [];
    this.goSupplierAging.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  //#endregion
  initGrid() {
    this.goSupplierAging = <GridOptions>{
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

  private initForm() {
    this.frmSupplierAging.reset();
    this.frmSupplierAging.patchValue({ dateUpto: new Date() });
    this.errors = [];
/*    this.goSupplierAging.api.setRowData([]);*/
    this.supplierAgingData = [];
    this.extractSupplierAgingData = [];
  }
  //#endregion local functions
}
