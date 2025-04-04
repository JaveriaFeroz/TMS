import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ComplaintType } from './complainttype';
import { ComplaintTypeService } from './complainttype.service';


@Component({
  selector: 'app-complainttype',
  templateUrl: './complainttype.component.html',
  styleUrls: ['./complainttype.component.css']
})

export class ComplaintTypeComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Complaint Type';
  readonly colSearch =
    [
      { headerName: 'Type Id', field: 'typeId', width: 90 },
      { headerName: 'Complaint Type', field: 'typeName', },
      { headerName: 'Active?', field: 'isActive', width: 70},
    ];
  //#endregion
  frmComplaintType: any;
  footer: agFooter = new agFooter();
  @ViewChild('typeName', { static: true }) typeName: ElementRef;
  @ViewChild('typeId', { static: true }) typeId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcCompalintType: ComplaintTypeService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmComplaintType = this.formbulider.group({
      typeId: [null, [Validators.required]],
      typeName: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmComplaintType.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmComplaintType.reset();
    this.frmComplaintType.enable();
    this.frmComplaintType.controls.typeId.disable();
    this.frmComplaintType.patchValue({  isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.typeName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmComplaintType.controls.typeId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.typeId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcCompalintType.getComplaintTypes().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Complaint Type", this.colSearch, r);
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
    this.frmComplaintType.enable();
    this.frmComplaintType.controls.typeId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.typeName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmComplaintType.markAllAsTouched();
      if (!this.frmComplaintType.invalid) {
        this.svcWaitDlg.open({});
        var formData: ComplaintType = this.frmComplaintType.getRawValue();
        formData.footer = this.footer;
        this.svcCompalintType.save(formData).subscribe(
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
      this.svcCompalintType.get(Id).subscribe(
        ct => {
          if (ct) {
            this.frmComplaintType.disable();
            this.frmComplaintType.controls['TypeId'].setValue(ct.typeId);
            this.frmComplaintType.controls['TypeName'].setValue(ct.typeName);
            this.frmComplaintType.controls['IsActive'].setValue(ct.isActive);
            this.footer = ct.footer;
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
    this.frmComplaintType.reset();
    this.frmComplaintType.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
