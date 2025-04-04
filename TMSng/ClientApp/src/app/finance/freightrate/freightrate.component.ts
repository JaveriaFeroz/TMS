import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { FreightRate } from './freightrate';
import { FreightRateService } from './freightrate.service';

@Component({
  selector: 'app-freightrate',
  templateUrl: './freightrate.component.html',
  styleUrls: ['./freightrate.component.css']
})

export class FreightRateComponent implements OnInit { 
  //#region constant variables
  readonly optionName: string = 'Freight Rate';
  
  //#endregion
  frmFreightRate: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('localRate0To64', { static: true }) localRate0To64: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcFreight: FreightRateService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService) {    
    this.get();
  }
  ngOnInit() {
    this.frmFreightRate = this.formbulider.group({
      localRate0To64: [null, [Validators.required]],
      localRate65To1980: [null, [Validators.required]],
      localRateAbove1980: [null, [Validators.required]],
      localRateHilly: [null, [Validators.required]],
      upCountryRate0To77: [null, [Validators.required]],
      upCountryRate78To560: [null, [Validators.required]],
      upCountryRateAbove560: [null, [Validators.required]],
      upCountryHilly: [null, [Validators.required]],
    });
    this.frmFreightRate.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }
  //#region toolbar functions
  //tbAdd() {
  //  this.frmFreightRate.reset();
  //  this.frmFreightRate.enable();
  //  agFormHelper.setFormControls(this.optionName, agFormMode.Add);
  //  this.frmFreightRate.nativeElement.focus();
  //}

  tbEdit() {
    this.frmFreightRate.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.localRate0To64.nativeElement.focus();
  }

  tbSave() {
    try {
      this.svcWaitDlg.open({});
      this.frmFreightRate.markAllAsTouched();
      if (!this.frmFreightRate.invalid) {
        var formData: FreightRate = this.frmFreightRate.getRawValue();    
        
          this.svcFreight.save(formData).subscribe(
            () => {
              this.svcToaster.showSuccess('Record saved Successfully');
              this.get();
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
    this.get();
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions
 
  //#region local functions
  get() {
    this.svcWaitDlg.open({});
    try {
      this.svcFreight.get().subscribe(
        FR => {
          if (FR) {
            this.frmFreightRate.disable();
            this.frmFreightRate.controls['localRate0To64'].setValue(FR.localRate0To64);
            this.frmFreightRate.controls['localRate65To1980'].setValue(FR.localRate65To1980);
            this.frmFreightRate.controls['localRateAbove1980'].setValue(FR.localRateAbove1980);
            this.frmFreightRate.controls['localRateHilly'].setValue(FR.localRateHilly);
            this.frmFreightRate.controls['upCountryRate0To77'].setValue(FR.upCountryRate0To77);
            this.frmFreightRate.controls['upCountryRate78To560'].setValue(FR.upCountryRate78To560);
            this.frmFreightRate.controls['upCountryRateAbove560'].setValue(FR.upCountryRateAbove560);
            this.frmFreightRate.controls['upCountryHilly'].setValue(FR.upCountryHilly);
            this.footer = FR.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else {
            this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }


  private initForm() {
    this.frmFreightRate.reset();
    this.frmFreightRate.disable();
    this.errors = [];   
    this.footer = new agFooter();
  }
  //#endregion local functions
}
