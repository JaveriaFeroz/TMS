import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ReOpenJobService } from './reopenjob.service';

@Component({
  selector: 'app-reopenjob',
  templateUrl: './reopenjob.component.html',
  styleUrls: ['./reopenjob.component.css']
})

export class ReOpenJobComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Re Open Job';
  //#endregion
  frmReOpenJob: any;
  errors: string[] = []; 
  viewOption: any;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcReopenJob: ReOpenJobService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService) {
  }

  ngOnInit() {
    this.frmReOpenJob = this.formbulider.group({
      jobNo: [null, [Validators.required]],
      reason: [null, [Validators.required]],
    });     
  }
  //#region toolbar functions
  tbSave() {
    try {
      this.frmReOpenJob.markAllAsTouched();
      if (!this.frmReOpenJob.invalid) {
        var formData = this.frmReOpenJob.getRawValue();
        this.svcWaitDlg.open({});
        this.svcReopenJob.reOpen(formData.jobNo, formData.reason).subscribe(
          () => {
            this.initForm();
            // agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
            this.svcToaster.showSuccess('Job re-opened Successfully');
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
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  } 
  //#endregion toolbar functions
  //#region local functions
  private initForm() {
    this.frmReOpenJob.reset();
    this.errors = [];  
  }
  //#endregion local functions
}
