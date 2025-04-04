import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { agFormHelper } from '../../helper/agFormHelper';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { WOExtractService } from './woextract.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-woextract',
  templateUrl: './woextract.component.html',
  styleUrls: ['./woextract.component.css']

})
export class WOExtractComponent implements OnInit {
  readonly optionName: string = 'List of Work Orders & Service Request';
  model: any = {};
  frmWOExtract: any;
  lstPeriod: any;
  errors: string[] = [];
  MinDate = new Date();
  MaxDate = new Date();
  Date = new Date();
  periodfrom: number;
  periodto: number;
  constructor(private router: Router, private formbulider: FormBuilder,
    //private inventoryadjustmentService: InventoryAdjustmentService,
    private svcWOExtract: WOExtractService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) { 
    this.loadLookup();
    this.periodfrom = agFormHelper.opsPeriodId();
    this.periodto = this.periodfrom;
    this.MinDate.setDate(this.Date.getDate() - 360);
    }

  ngOnInit(): void {
    this.frmWOExtract = this.formbulider.group({
      selection: ["1", [Validators.required]],
      periodFrom: [null],
      periodTo: [null],
      dateFrom: [null],
      dateTo: [null ],     
    });
    this.frmWOExtract.patchValue({ selection: "1", periodFrom: this.periodfrom, periodTo: this.periodto, dateFrom: new Date(), dateTo: new Date() });
  }

 //#region toolbar functions
  tbExit() {
    this.router.navigate(['/MainForm']);
  }

  tbUndo() {
    this.frmWOExtract.reset();
  }

  tbExport() {
    try {
      var formData = this.frmWOExtract.getRawValue();
      //if (formData.DateFrom === '01011970') {
      //  formData.DateFrom = "";
      //}
      //if (formData.DateTo === '01011970') {
      //  formData.DateTo = "";
      //}
      //frmWOExtract.companyid = JSON.parse(sessionStorage.getItem("CompanyId"));
      this.validate(formData);
      if (this.errors.length > 0) { return; }
      else {
        if (formData.selection == 1) {
          //frmWOExtract.DateFrom = formatDate(frmWOExtract.DateFrom, 'dd-MM-yyyy', 'en-US');
          //frmWOExtract.DateTo = formatDate(frmWOExtract.DateTo, 'dd-MM-yyyy', 'en-US');
          this.svcWOExtract.getPendingRequest(formData.dateFrom, formData.dateTo).subscribe(
            (PC) => {
              if (Object.keys(PC).length > 0) {
                this.ExportDatatoExcel(PC, 'PendingServiceRequest.xlsx');
                this.frmWOExtract.reset();
              }
              else {
                this.svcToaster.showWarning('No record found with your provided key value ');
              }              
            },
            (error) => { this.errors.push(error); }
          );
        }
        else if (formData.selection == 2) {
          //frmWOExtract.DateFrom = formatDate(frmWOExtract.DateFrom, 'dd-MM-yyyy', 'en-US');
          //frmWOExtract.DateTo = formatDate(frmWOExtract.DateTo, 'dd-MM-yyyy', 'en-US');
          this.svcWOExtract.getPending(formData.dateFrom, formData.dateTo).subscribe(
            (PWO) => {
              if (Object.keys(PWO).length > 0) {
                this.ExportDatatoExcel(PWO, 'PendingWO.xlsx');
                this.frmWOExtract.reset();
              }
              else {
                this.svcToaster.showWarning('No record found with your provided key value ');
              }
            },
            (error) => { this.errors.push(error); }
          );
        }
        else if (formData.selection == 3) {
          this.svcWOExtract.getClosed(formData.periodFrom, formData.periodTo).subscribe(
            (CWO) => {
              if (Object.keys(CWO).length > 0) {
                this.ExportDatatoExcel(CWO, 'ClosedWO.xlsx');
                this.frmWOExtract.reset();
              }
              else {
                this.svcToaster.showWarning('No record found with your provided key value ');
              }         
              //this.excelService.exportAsExcelFile(data, 'ClosedWO');
              //const ws: xlsx.WorkSheet =
              //xlsx.utils.table_to_sheet(data);
              //const wb: xlsx.WorkBook = xlsx.utils.book_new();
              //xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
              //xlsx.writeFile(wb, 'ClosedWO.xlsx');                    

            }, (error) => {  this.svcToaster.showFailure(error); },          
          );
        }

        this.frmWOExtract.patchValue({ selection: "1", periodFrom: this.periodfrom, periodTo: this.periodto, dateFrom: new Date(), dateTo: new Date() });
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

  private loadLookup() {
    try {
      this.svcWOExtract.getLookup().subscribe(
        data => {
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

  private validate(woe: any) {
    this.errors = [];
    if (woe.selection < 3) {
      if (woe.dateTo == "" || woe.dateFrom=="") {
        this.errors.push('please select valid Date From & Date To before hitting Download button');
      }
      if (woe.dateTo < woe.dateFrom) {
        this.errors.push('Date From must always be older than Date To. Please correct your date range criteria and entry');
      }
    }
    else {
      if (woe.periodFrom == null || woe.periodTo == null) {
        this.errors.push('Please enter valid Period From & Period To before hitting Download button');

      }    
      else if (woe.periodFrom > woe.periodTo) {
        this.errors.push('Period From must always be older or equal to Period To. Please correct your Period range criteria and retry');
      }
    }
  }
   //#endregion local functions
}
