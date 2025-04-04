import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Activity } from './activity';
import { ActivityService } from './activity.service';

@Component({  
  selector: 'app-activity',  
  templateUrl: './activity.component.html',  
  styleUrls: ['./activity.component.css']  
})  

export class ActivityComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Activity';
  readonly colSearch =
  [
      { headerName: 'Activity Id', field: 'activityId', width: 70 },
      { headerName: 'Activity Name', field: 'activityName', },
      { headerName: 'Is Active', field: 'isActive', width: 70 },
    ];
  //#endregion
  frmActivity: any;
  footer: agFooter = new agFooter();
  @ViewChild('activityName', { static: true }) activityName: ElementRef;
  @ViewChild('activityId', { static: true }) activityId: ElementRef;

  constructor(private router:Router, private formbulider: FormBuilder,
    private svcActivity: ActivityService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {       
  }  
  
  ngOnInit() {
    this.frmActivity = this.formbulider.group({
      activityId: [null, [Validators.required]],
      activityName: [null, [Validators.required]],
      estHRsReq: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmActivity.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmActivity.reset();  
    this.frmActivity.enable();
    this.frmActivity.controls.activityId.disable();
    this.frmActivity.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.activityName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmActivity.controls.activityId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.activityId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcActivity.getActivities().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Activity", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.activityId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmActivity.enable();
    this.frmActivity.controls.activityId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.activityName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmActivity.markAllAsTouched();
      if (!this.frmActivity.invalid) {
        this.svcWaitDlg.open({});
        var formData: Activity = this.frmActivity.getRawValue();
        formData.footer = this.footer;
        this.svcActivity.save(formData).subscribe(
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
      this.svcActivity.get(Id).subscribe(
        activity => {
          if (activity) {
            this.frmActivity.disable();
            this.frmActivity.controls['activityId'].setValue(activity.activityId);
            this.frmActivity.controls['activityName'].setValue(activity.activityName);
            this.frmActivity.controls['estHRsReq'].setValue(activity.estHrsReq);
            this.frmActivity.controls['isActive'].setValue(activity.isActive);
            this.footer = activity.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private initForm() {
    this.frmActivity.reset();    
    this.frmActivity.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
