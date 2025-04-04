import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Detention } from './detention';
import { DetentionService } from './detention.service';

@Component({
  selector: 'app-detention',
  templateUrl: './detention.component.html',
  styleUrls: ['./detention.component.css']
})

export class DetentionComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Detention';
  readonly colSearch =
    [
      { headerName: 'Id', field: 'detentionId', width: 70 },
      { headerName: 'Detention Narration', field: 'detentionName', },
      { headerName: 'Is Active', field: 'isActive', width: 70},
    ];
  //#endregion
  frmDetention: any;
  footer: agFooter = new agFooter();
  @ViewChild('detentionName', { static: true }) detentionName: ElementRef;
  @ViewChild('detentionId', { static: true }) detentionId: ElementRef;

  constructor(private detentionR: Router, private formbulider: FormBuilder,
    private svcDetention: DetentionService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmDetention = this.formbulider.group({
      detentionId: [null, [Validators.required]],
      detentionName: [null, [Validators.required]],
      hRsThreshold: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmDetention.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmDetention.reset();
    this.frmDetention.enable();
    this.frmDetention.controls.detentionId.disable();
    this.frmDetention.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.detentionName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmDetention.controls.detentionId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.detentionId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcDetention.getDetentions().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Detention", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.detentionId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmDetention.enable();
    this.frmDetention.controls.detentionId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.detentionName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmDetention.markAllAsTouched();
      if (!this.frmDetention.invalid) {
        this.svcWaitDlg.open({});
        var formData: Detention = this.frmDetention.getRawValue();
        formData.footer = this.footer;
        this.svcDetention.save(formData).subscribe(
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
    this.detentionR.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcDetention.get(Id).subscribe(
        det => {
          if (det) {
            this.frmDetention.disable();
            this.frmDetention.controls['detentionId'].setValue(det.detentionId);
            this.frmDetention.controls['detentionName'].setValue(det.detentionName);
            this.frmDetention.controls['hRsThreshold'].setValue(det.hRsThreshold);
            this.frmDetention.controls['isActive'].setValue(det.isActive);
            this.footer = det.footer;
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
    this.frmDetention.reset();
    this.frmDetention.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
