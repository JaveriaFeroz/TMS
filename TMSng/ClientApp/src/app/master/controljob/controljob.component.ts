import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ControlJob } from './controljob';
import { ControlJobService } from './controljob.service';

@Component({  
  selector: 'app-controljob',  
  templateUrl: './controljob.component.html',  
  styleUrls: ['./controljob.component.css']  
})  

export class ControlJobComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Control Job';
  //#endregion
  frmControlJob: any;

  constructor(private router:Router, private formbulider: FormBuilder,
    private svcControlJob: ControlJobService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService) {       
  }  
  
  ngOnInit() {
    this.frmControlJob = this.formbulider.group({
      period: [null],
      revenueJobNo: [null],
      costJobNo: [null],
      maintenanceJobNo: [null], 
    });
    this.frmControlJob.disable();
    this.get();
    //agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }
  //#region toolbar functions  
  tbSave() {
    this.frmControlJob.markAllAsTouched();
      if (!this.frmControlJob.invalid) {
        this.svcWaitDlg.open({});
        var formData: ControlJob = this.frmControlJob.getRawValue();
        this.svcControlJob.save(formData).subscribe(
          () => {
            this.initForm();
            // agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
            this.svcToaster.showSuccess('Record saved Successfully');
            this.get();
            this.svcWaitDlg.close();
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); }
        );
      }     
  }

  tbUndo() {
    this.initForm();
    // agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get() {  
    try {
      this.svcControlJob.get().subscribe(
        controljob => {
          if (controljob) {
            this.frmControlJob.disable();
            this.frmControlJob.controls['period'].setValue(controljob.period);
            this.frmControlJob.controls['revenueJobNo'].setValue(controljob.revenueJobNo);
            this.frmControlJob.controls['costJobNo'].setValue(controljob.costJobNo);
            this.frmControlJob.controls['maintenanceJobNo'].setValue(controljob.maintenanceJobNo);  
         //   agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            this.frmControlJob.controls.revenueJobNo.enable();
            this.frmControlJob.controls.costJobNo.enable();
            this.frmControlJob.controls.maintenanceJobNo.enable();
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
      },
        error => { this.svcToaster.showFailure(error); },
        () => {  });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private initForm() {
    this.frmControlJob.reset();
    this.frmControlJob.disable();
  }
  //#endregion local functions
}
