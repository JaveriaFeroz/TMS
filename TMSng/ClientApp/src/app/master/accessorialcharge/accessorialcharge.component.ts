import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { AccessorialCharge } from './accessorialcharge';
import { AccessorialChargeService } from './accessorialcharge.service';

@Component({  
  selector: 'app-accessorialcharge',  
  templateUrl: './accessorialcharge.component.html',  
  styleUrls: ['./accessorialcharge.component.css']  
})  

export class AccessorialChargeComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Accessorial Charge';
  readonly colSearch =
    [
      { headerName: 'Acc Charge Id', field: 'chargeId', width: 70 },
      { headerName: 'Acc Charge Name', field: 'chargeName', },
      { headerName: 'Is Active', field: 'isActive', width: 70 },
    ];
  //#endregion
  frmAccCharge: any;
  lstChargeCode: any;
  footer: agFooter = new agFooter();
  @ViewChild('chargeName', { static: true }) chargeName: ElementRef;
  @ViewChild('chargeId', { static: true }) chargeId: ElementRef;

  constructor(private router:Router, private formbulider: FormBuilder,
    private svcAccCharge: AccessorialChargeService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {       
  }  
  
  ngOnInit() {
    this.frmAccCharge = this.formbulider.group({
      chargeId: [null, [Validators.required]],
      chargeName: [null, [Validators.required]],
      chargeCode: [null, [Validators.required]],
      isActive: [null],
    });
    this.loadLookup();
    this.frmAccCharge.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmAccCharge.reset();  
    this.frmAccCharge.enable();
    this.frmAccCharge.controls.chargeId.disable();
    this.frmAccCharge.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.chargeName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmAccCharge.controls.chargeId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.chargeId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcAccCharge.getCharges().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Accessorial Charge", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.chargeId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmAccCharge.enable();
    this.frmAccCharge.controls.chargeId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.chargeName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmAccCharge.markAllAsTouched();
      if (!this.frmAccCharge.invalid) {
        this.svcWaitDlg.open({});
        var formData: AccessorialCharge = this.frmAccCharge.getRawValue();
        formData.footer = this.footer;
        this.svcAccCharge.save(formData).subscribe(
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
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcAccCharge.get(Id).subscribe(
        acc => {
          if (acc) {
            this.frmAccCharge.disable();
            this.frmAccCharge.controls['chargeId'].setValue(acc.chargeId);
            this.frmAccCharge.controls['chargeName'].setValue(acc.chargeName);
            this.frmAccCharge.controls['chargeCode'].setValue(acc.chargeCode);
            this.frmAccCharge.controls['isActive'].setValue(acc.isActive);
            this.footer = acc.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcAccCharge.getLookup().subscribe(
        data => {
          this.lstChargeCode = data.lstChargeCode;
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
    this.frmAccCharge.reset();    
    this.frmAccCharge.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
