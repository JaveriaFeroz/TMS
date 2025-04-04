import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { HoseType } from './hosetype';
import { HoseTypeService } from './hosetype.service';

@Component({  
  selector: 'app-hosetype',  
  templateUrl: './hose-type.component.html',  
  styleUrls: ['./hose-type.component.css']  
})  

export class HoseTypeComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Hose Type';
  readonly colSearch =
    [
      { headerName: 'Id', field: 'hoseTypeId', width: 70 },
      { headerName: 'Hose Type Name', field: 'hoseTypeName', },
      { headerName: 'Is Active', field: 'isActive', width: 70 },
    ];
  //#endregion
  frmHoseType: any;
  footer: agFooter = new agFooter();
  @ViewChild('hoseTypeName', { static: true }) hoseTypeName: ElementRef;
  @ViewChild('hoseTypeId', { static: true }) hoseTypeId: ElementRef;

  constructor(private router:Router, private formbulider: FormBuilder,
    private svcHoseType: HoseTypeService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {       
  }  
  
  ngOnInit() {
    this.frmHoseType = this.formbulider.group({
      hoseTypeId: [null, [Validators.required]],
      hoseTypeName: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmHoseType.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmHoseType.reset();  
    this.frmHoseType.enable();
    this.frmHoseType.controls.hoseTypeId.disable();
    this.frmHoseType.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.hoseTypeName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmHoseType.controls.hoseTypeId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.hoseTypeId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcHoseType.getHoseTypes().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Hose Type", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.hoseTypeId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmHoseType.enable();
    this.frmHoseType.controls.hoseTypeId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.hoseTypeName.nativeElement.focus();
  }

  tbSave() {
    try {
      if (!this.frmHoseType.invalid) {
        this.svcWaitDlg.open({});
        var formData: HoseType = this.frmHoseType.getRawValue();
        formData.footer = this.footer;
        this.svcHoseType.save(formData).subscribe(
          () => {
            this.initForm();
            agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
            this.svcToaster.showSuccess('Record saved Successfully');
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); });
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
      this.svcHoseType.get(Id).subscribe(
        hosetype => {
          if (hosetype) {
            this.frmHoseType.disable();
            this.frmHoseType.controls['hoseTypeId'].setValue(hosetype.hoseTypeId);
            this.frmHoseType.controls['hoseTypeName'].setValue(hosetype.hoseTypeName);
            this.frmHoseType.controls['isActive'].setValue(hosetype.isActive);
            this.footer = hosetype.footer;
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
    this.frmHoseType.reset();
    this.frmHoseType.disable();
    this.footer = new agFooter();
   // 
  }
  //#endregion local functions
}
