import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { WHTaxExemption } from './whtaxexemption';
import { WHTaxExemptionService } from './whtaxexemption.service';

@Component({
  selector: 'app-whtaxexemption',
  templateUrl: './whtaxexemption.component.html',
  styleUrls: ['./whtaxexemption.component.css']
})

export class WHTaxExemptionComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'WH Tax Exemption';
  readonly colSearch =
    [
      { headerName: 'Exemption Id', field: 'exemptionId', width: 70 },
      { headerName: 'Date  From', field: 'dateFrom' },
      { headerName: 'Date To', field: 'dateTo'},
    ];
  //#endregion
  frmWHTaxExemption: any;
  lstWHTaxExemptionType: any;
  footer: agFooter = new agFooter();
  errors: string[] = [];
  @ViewChild('dateFrom', { static: true }) dateFrom: ElementRef;
  @ViewChild('exemptionId', { static: true }) exemptionId: ElementRef;

  constructor(private whtaxexemptionr: Router, private formbulider: FormBuilder,
    private svcWHTExemption: WHTaxExemptionService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmWHTaxExemption = this.formbulider.group({
      exemptionId: [null, [Validators.required]],
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]],
    });
    this.frmWHTaxExemption.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmWHTaxExemption.reset();
    this.frmWHTaxExemption.enable();
    this.frmWHTaxExemption.controls.exemptionId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.dateFrom.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmWHTaxExemption.controls.exemptionId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.exemptionId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcWHTExemption.getExemptions().subscribe(r => {
        this.svcSearchDlg.open("Search & Select WHTaxExemption", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.exemptionId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmWHTaxExemption.enable();
    this.frmWHTaxExemption.controls.exemptionId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.dateFrom.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmWHTaxExemption.markAllAsTouched();    
      if (!this.frmWHTaxExemption.invalid) {
        var formData: WHTaxExemption = this.frmWHTaxExemption.getRawValue();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcWHTExemption.save(formData).subscribe(
            () => {
              this.initForm();
              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
              this.svcToaster.showSuccess('Record saved Successfully');
            },
            error => { this.svcToaster.showFailure(error); },
            () => { this.svcWaitDlg.close(); }
          );
        }        
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    this.whtaxexemptionr.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcWHTExemption.get(Id).subscribe(
        whtaxexemption => {
          if (whtaxexemption) {
            this.frmWHTaxExemption.disable();
            this.frmWHTaxExemption.controls['exemptionId'].setValue(whtaxexemption.exemptionId);
            this.frmWHTaxExemption.controls['dateFrom'].setValue(whtaxexemption.dateFrom);
            this.frmWHTaxExemption.controls['dateTo'].setValue(whtaxexemption.dateTo);
            this.footer = whtaxexemption.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private validate(WH: WHTaxExemption) {
    this.errors = [];

    if (WH.dateFrom >= WH.dateTo) {
      this.errors.push('Please enter Valid Date as DateFrom cannot be greater then DateTo');
    }
  }

  private initForm() {
    this.frmWHTaxExemption.reset();    
    this.frmWHTaxExemption.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
