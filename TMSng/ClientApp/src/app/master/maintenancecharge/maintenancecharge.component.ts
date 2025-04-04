import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { MaintenanceCharge } from './maintenancecharge';
import { MaintenanceChargeService } from './maintenancecharge.service';


@Component({
  selector: 'app-maintenancecharge',
  templateUrl: './maintenancecharge.component.html',
  styleUrls: ['./maintenancecharge.component.css']
})

export class MaintenanceChargeComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Maintenance Charge';
  readonly colSearch =
    [
      { headerName: 'Charge Id', field: 'chargeId', width: 70 },
      { headerName: 'Charge Name', field: 'chargeName', },
      { headerName: 'Is Active', field: 'isActive', },
    ];
  //#endregion
  frmMaintenanceCharge: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('chargeName', { static: true }) chargeName: ElementRef;
  @ViewChild('chargeId', { static: true }) chargeId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private chargeService: MaintenanceChargeService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmMaintenanceCharge = this.formbulider.group({
      chargeId: [null, [Validators.required]],
      chargeName: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmMaintenanceCharge.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmMaintenanceCharge.reset();
    this.frmMaintenanceCharge.enable();
    this.frmMaintenanceCharge.controls.chargeId.disable();
    this.frmMaintenanceCharge.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.chargeName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmMaintenanceCharge.controls.chargeId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.chargeId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.chargeService.GetMaintenanceCharges().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Non Inventory Product", this.colSearch, r);
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
    this.frmMaintenanceCharge.enable();
    this.frmMaintenanceCharge.controls.chargeId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.chargeName.nativeElement.focus();
  }

  tbSave() {
    try {
    this.frmMaintenanceCharge.markAllAsTouched();
    if (!this.frmMaintenanceCharge.invalid) {
      this.svcWaitDlg.open({});
      var formData: MaintenanceCharge = this.frmMaintenanceCharge.getRawValue();
      formData.footer = this.footer;
      this.chargeService.Save(formData).subscribe(
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
      this.chargeService.Get(Id).subscribe(
        charge => {
          if (charge) {
            this.frmMaintenanceCharge.disable();
            this.frmMaintenanceCharge.controls['chargeId'].setValue(charge.chargeId);
            this.frmMaintenanceCharge.controls['chargeName'].setValue(charge.chargeName);
            this.frmMaintenanceCharge.controls['isActive'].setValue(charge.isActive);
            this.footer = charge.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  private initForm() {
    this.frmMaintenanceCharge.reset();    
    this.frmMaintenanceCharge.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
