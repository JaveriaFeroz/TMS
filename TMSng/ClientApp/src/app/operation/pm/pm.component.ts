import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { PM } from './pm';
import { PMService } from './pm.service';

@Component({
  selector: 'app-pm',
  templateUrl: './pm.component.html',
  styleUrls: ['./pm.component.css']
})

export class PMComponent implements OnInit {
  //#region form variables
  readonly optionName: string = 'Preventive Maintenance';
  readonly colSearch =
    [
      { headerName: 'Id', field: 'pmId', width: 70 },
      { headerName: 'Type', field: 'capacityName', },
      { headerName: 'Make', field: 'assetMakeName' },
      { headerName: 'Activity Type', field: 'activityName', width: 250 },
      { headerName: 'Active?', field: 'isActive', width: 50 },
    ];
  frmPM: any;
  lstAssetMake: any;
  lstCapacity: any;
  lstActivity: any;
  footer: agFooter = new agFooter();
  errors: string[] = [];
  @ViewChild('activityId', { static: true }) activityId: MatSelect;
  @ViewChild('pmId', { static: true }) pmId: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcPM: PMService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmPM = this.formbulider.group({
      pmId: [null, [Validators.required]],
      capacityId: [null, [Validators.required]],
      assetMakeId: [null, [Validators.required]],
      activityId: [null, [Validators.required]],
      alertKMs: [null, [Validators.required]],
      dueKMs: [null, [Validators.required]],
      isActive: [null],  
    });
    this.frmPM.disable();
    this.loadLookup();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmPM.reset();
    this.frmPM.enable();
    this.frmPM.controls.pmId.disable();
    this.frmPM.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.activityId.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmPM.controls.pmId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.pmId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcPM.getPMs().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Maintenance Plan", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) { this.get(r.pmId); }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmPM.enable();
    this.frmPM.controls.pmId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.activityId.focus();
  }

  tbSave() {
    try {
      this.frmPM.markAllAsTouched();
      if (!this.frmPM.invalid) {
        var formData: PM = this.frmPM.getRawValue();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return
        }
        else {
          this.svcWaitDlg.open({});
          this.svcPM.save(formData).subscribe(
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
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcPM.get(Id).subscribe(
        pm => {
          if (pm) {
            this.frmPM.disable();
            this.frmPM.controls['pmId'].setValue(pm.pmId);         
            this.frmPM.controls['activityId'].setValue(pm.activityId);
            this.frmPM.controls['capacityId'].setValue(pm.capacityId);
            this.frmPM.controls['assetMakeId'].setValue(pm.assetMakeId);
            this.frmPM.controls['alertKMs'].setValue(pm.alertKMs);
            this.frmPM.controls['dueKMs'].setValue(pm.dueKMs);
            this.frmPM.controls['isActive'].setValue(pm.isActive);
            this.footer = pm.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcPM.getLookUp().subscribe(
        data => {
          this.lstAssetMake = data.lstAssetMake;
          this.lstCapacity = data.lstCapacity;
          this.lstActivity = data.lstActivity;
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

  private validate(pm: PM) {
    this.errors = []; 
    if (pm.dueKMs < pm.alertKMs) {
      this.errors.push('Due KMs can not be less than Alert KMs');
    } 
  }

  private initForm() {
    this.frmPM.reset();
    this.frmPM.disable();
    this.errors = [];  
  }
}
