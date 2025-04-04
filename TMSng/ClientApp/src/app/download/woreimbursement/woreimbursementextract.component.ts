import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { agFormHelper } from '../../helper/agFormHelper';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { WOReImbursementExtractService } from './woreimbursementextract.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-woreimbursementextract',
  templateUrl: './woreimbursementextract.component.html',
  styleUrls: ['./woreimbursementextract.component.css']
})
export class WOReImbursementExtractComponent implements OnInit {
  readonly optionName: string = 'Work Order ReImbursement Extract';
  frmWOReImbursementExtract: any;
  lstSupplier: any;
  lstBranch: any;
  lstSubCategory: any;
  lstPeriod: any;
  periodfrom: number;
  periodto: number;
  errors: string[] = [];

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcWOReImbursement: WOReImbursementExtractService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) { 
    this.loadLookup();
    this.periodfrom = agFormHelper.opsPeriodId();
    this.periodto = this.periodfrom;
    }

  ngOnInit(): void {
    this.frmWOReImbursementExtract = this.formbulider.group({
      supplierId: [null],
      branchId: [null],
      subCategoryId: [null],
      periodFrom: [null, [Validators.required]],
      periodTo: [null, [Validators.required]],   
    });
    this.frmWOReImbursementExtract.patchValue({ periodFrom: this.periodfrom, periodTo: this.periodto });
  }

 //#region toolbar functions
  tbExit() {
    this.router.navigate(['/MainForm']);
  }

  tbUndo() {
    this.frmWOReImbursementExtract.patchValue({ periodFrom: this.periodfrom, periodTo: this.periodto });
    this.frmWOReImbursementExtract.reset();
  }

  tbExport() {
    try {
      this.frmWOReImbursementExtract.markAllAsTouched();
      const formData = this.frmWOReImbursementExtract.getRawValue();
      this.validate(formData);
      if (this.errors.length > 0) {
        return;
      }
      else {
        if (formData.subCategoryId == null) {
          formData.subCategoryId = 0
        }
        if (formData.supplierId == null) {
          formData.supplierId = 0
        }
        this.svcWOReImbursement.get(formData.branchId, formData.supplierId, formData.subCategoryId, formData.periodFrom, formData.periodTo).subscribe(
            (WOReimb) => {
            if (Object.keys(WOReimb).length > 0) {
              this.ExportDatatoExcel(WOReimb, 'WOReImbursement.xlsx');
                this.frmWOReImbursementExtract.patchValue({ periodFrom: this.periodfrom, periodTo: this.periodto });
                this.frmWOReImbursementExtract.reset();
              }
              else {
                this.svcToaster.showWarning('No record found with your provided key value ');
              }
              //this.excelService.exportAsExcelFile(data, 'PendingComplaint');
              //const ws: xlsx.WorkSheet =
              //xlsx.utils.table_to_sheet(data);
              //const wb: xlsx.WorkBook = xlsx.utils.book_new();
              //xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
              //xlsx.writeFile(wb, 'PendingComplaint.xlsx');
            },
            (error) => { this.svcToaster.showFailure(error)}
          );
      }
      this.frmWOReImbursementExtract.patchValue({ periodFrom: this.periodfrom, periodTo: this.periodto });
    }
    catch (e) { this.svcToaster.showFailure(e); }  }


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
      this.svcWOReImbursement.getLookup().subscribe(
        data => {
          this.lstBranch = data.lstBranch;
          this.lstSupplier = data.lstSupplier;
          this.lstSubCategory = data.lstSubCategory;
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
    
    if (woe.periodFrom > woe.periodTo) {
      this.errors.push('Period From must always be older or equal to Period To. Please correct your Period range criteria and retry');
    }
  }
   //#endregion local functions


}
