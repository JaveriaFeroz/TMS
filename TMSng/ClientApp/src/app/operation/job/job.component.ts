import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Job } from './job';
import { JobService } from './job.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Job';
  readonly colSearch =
    [
      { headerName: 'Job #', field: 'jobNo' },
      { headerName: 'Job Date', field: 'jobDate' },
      { headerName: 'Job Start Date', field: 'startDate' },
      { headerName: 'Status', field: 'stateName' },
      { headerName: 'Created By', field: 'createdBy' },
      { headerName: 'Created On', field: 'createdOn' },
    ];
  //#endregion
  frmJob: any;
  footer: agFooter = new agFooter();
  MinDate = new Date().getDate() - 45;
  MaxDate = new Date();
  errors: string[] = [];
  @ViewChild('jobNo', { static: true }) jobNo: ElementRef;
  @ViewChild('jobDate', { static: true }) jobDate: MatInput;

  constructor(private jobr: Router, private formbulider: FormBuilder,
    private svcJob: JobService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService,
    private svcSearchDlg: SearchDialogService, private Enum: AgilityEnum) {}

  ngOnInit() {
    this.frmJob = this.formbulider.group({
      jobNo: [null, [Validators.required]],
      jobId: [null],
      jobDate: [null, [Validators.required]],
      jobStartDate: [null, [Validators.required]],
      jobStartTime: [null, [Validators.required]],
      advance: [null],
      stateName: [null],
      //JobStatusId: [null],
    });
    this.frmJob.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmJob.reset();
    this.frmJob.enable();
    this.frmJob.controls.jobNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.frmJob.patchValue({ jobDate: new Date(), jobStartDate: new Date(), jobStartTime: formatDate(new Date(), 'HH:mm', 'en-US') , stateName: "Open", advance:0});
    //this.frmJob.controls.State.disable();
    this.jobDate.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmJob.controls.jobNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.jobNo.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcJob.getJobs().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Job", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.jobNo);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmJob.enable();
    this.frmJob.controls.jobNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    //this.frmJob.controls.JobStatus.disable();
    this.jobDate.focus();
  }

  tbSave() {
    try {
      this.frmJob.markAllAsTouched();
      if (!this.frmJob.invalid) {
        this.svcWaitDlg.open({});
        var formData: Job = this.frmJob.getRawValue();
        formData.footer = this.footer;
        this.svcJob.save(formData).subscribe(
          data => {
            this.initForm();
            agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
            this.svcToaster.showSuccess('Job # ' + data.jobNo + ' saved successfully');
          },
          error => {
            this.svcToaster.showFailure(error);
          },
          () => { this.svcWaitDlg.close(); }
        );
      }
    }
    catch (e) {
      this.svcWaitDlg.close();
      this.svcToaster.showFailure(e);
    }
  }

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    this.jobr.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get(jobNo: string) {
    jobNo = agFormHelper.padL(jobNo);
    this.svcWaitDlg.open({});
    try {
      this.svcJob.get(jobNo).subscribe(
        job => {
          if (job) {
            this.frmJob.disable();
            this.frmJob.controls['jobNo'].setValue(job.jobNo);
            this.frmJob.controls['jobId'].setValue(job.jobId);
            this.frmJob.controls['jobDate'].setValue(job.jobDate);
            this.frmJob.controls['jobStartDate'].setValue(job.jobStartDate);
            this.frmJob.controls['jobStartTime'].setValue(formatDate(job.jobStartTime, 'HH:mm', 'en-US'));
            this.frmJob.controls['stateName'].setValue(job.stateName);
            this.frmJob.controls['advance'].setValue(job.advance);  
            this.footer = job.footer;
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
    this.frmJob.reset();
    this.frmJob.disable();
    this.errors = [];    
    this.footer = new agFooter();
  }
  //#endregion local functions
}
