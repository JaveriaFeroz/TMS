import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper } from '../../helper/agFormHelper';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { FinancialPeriodService } from './financialperiod.service';

@Component({  
  selector: 'app-financialperiod',  
  templateUrl: './financialperiod.component.html',  
  styleUrls: ['./financialperiod.component.css']  
})  

export class FinancialPeriodComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Period Closure';
  //#endregion
  frmFinancialPeriod: any;
  periodName: string;
  enableGLEntries: boolean = false;
  lstPeriodType: any = [
    { periodTypeId: 1, periodTypeName: 'Operational' },
    { periodTypeId: 2, periodTypeName: 'GL' },
    { periodTypeId: 3, periodTypeName: 'AR' },
    { periodTypeId: 4, periodTypeName: 'AP' },
  ];
  constructor(private router: Router, private formbulider: FormBuilder, private svcWaitDlg: WaitDialogService,
    private svcFinancialPeriod: FinancialPeriodService, private svcToaster: agToasterService) {
   //this.periodName = agFormHelper.periodName();
    this.get();
    this.enableGLEntries = agFormHelper.enableGL();
    //alert(this.periodName);
    //alert(this.enableGLEntries);
  }  
  
  ngOnInit() {
    this.frmFinancialPeriod = this.formbulider.group({
      periodName: [null],
      periodTypeId: [1],
      //currentMonth: [null],
      //currentYear: [null], 
    });
    this.frmFinancialPeriod.disable();
    this.frmFinancialPeriod.patchValue({ periodTypeId: 1, periodName: this.periodName });
    if (this.enableGLEntries) {
      this.frmFinancialPeriod.controls.periodTypeId.enable();
    }

    //this.get();
    //agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }
  //#region toolbar functions
  tbSave() {
    if (!this.frmFinancialPeriod.invalid) {
      this.svcWaitDlg.open({});
      var formData = this.frmFinancialPeriod.getRawValue();
      this.svcFinancialPeriod.close(formData.periodTypeId).subscribe(
        () => {
          this.initForm();
        //  agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
          this.svcToaster.showSuccess('Current period closure and new Financial period opening completed successfully');
          this.get();
          //if (this.enableGLEntries) {
            this.frmFinancialPeriod.controls.periodTypeId.enable();
          //}
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
      this.svcFinancialPeriod.get(1).subscribe(
        financialperiod => {
          if (financialperiod) {
            //this.frmFinancialPeriod.disable();
            this.frmFinancialPeriod.controls['periodName'].setValue(financialperiod.periodName);
            this.frmFinancialPeriod.controls['periodTypeId'].setValue(1);
           /* this.frmFinancialPeriod.controls['periodTypeId'].setValue(financialperiod.periodId);*/
         //   agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
      },
        error => { this.svcToaster.showFailure(error); },
        () => {  });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  onPeriodChanged(id: number) {
    try {
      this.svcFinancialPeriod.get(id).subscribe(
        financialperiod => {
          if (financialperiod) {
            //this.frmFinancialPeriod.disable();
            this.frmFinancialPeriod.controls['periodName'].setValue(financialperiod.periodName);
            this.frmFinancialPeriod.controls['periodTypeId'].setValue(id);
           /* this.frmFinancialPeriod.controls['periodTypeId'].setValue(financialperiod.periodId);*/
            //   agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private initForm() {
    this.frmFinancialPeriod.reset();
    this.frmFinancialPeriod.disable();
    if (this.enableGLEntries) {
      this.frmFinancialPeriod.controls.periodTypeId.enable();
    }
  }
  //#endregion local functions
}
