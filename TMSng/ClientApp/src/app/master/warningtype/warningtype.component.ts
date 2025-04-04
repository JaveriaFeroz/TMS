import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { WarningType } from './warningtype';
import { WarningTypeService } from './warningtype.service';

@Component({
  selector: 'app-warningtype',
  templateUrl: './warningtype.component.html',
  styleUrls: ['./warningtype.component.css']
})

export class WarningTypeComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Warning Type';
  readonly colSearch =
    [
      { headerName: 'Type Id', field: 'typeId', width: 70 },
      { headerName: 'Type Name', field: 'typeName', },
      { headerName: 'Is Active', field: 'isActive', width: 70},
    ];
  //#endregion
  frmWarningType: any;
  lstWarningTypeType: any;
  footer: agFooter = new agFooter();
  @ViewChild('typeName', { static: true }) typeName: ElementRef;
  @ViewChild('typeId', { static: true }) typeId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcWarningType: WarningTypeService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmWarningType = this.formbulider.group({
      typeId: [null, [Validators.required]],
      typeName: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmWarningType.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmWarningType.reset();
    this.frmWarningType.enable();
    this.frmWarningType.controls.typeId.disable();
    this.frmWarningType.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.typeName.nativeElement.focus();

  }
  tbRecall() {
    this.initForm();
    this.frmWarningType.controls.typeId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.typeId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcWarningType.getWarningTypes().subscribe(r => {
        this.svcSearchDlg.open("Search & Select WarningType", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.typeId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmWarningType.enable();
    this.frmWarningType.controls.typeId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.typeName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmWarningType.markAllAsTouched();
    
    if (!this.frmWarningType.invalid) {
      this.svcWaitDlg.open({});
      var formData: WarningType = this.frmWarningType.getRawValue();
      formData.footer = this.footer;
      this.svcWarningType.save(formData).subscribe(
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
      this.svcWarningType.get(Id).subscribe(
        warningtype => {
          if (warningtype) {
            this.frmWarningType.disable();
            this.frmWarningType.controls['typeId'].setValue(warningtype.typeId);
            this.frmWarningType.controls['typeName'].setValue(warningtype.typeName);
            this.frmWarningType.controls['isActive'].setValue(warningtype.isActive);  
            this.footer = warningtype.footer;
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
    this.frmWarningType.reset();
    this.frmWarningType.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
