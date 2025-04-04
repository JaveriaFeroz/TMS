import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Complainant } from './complainant';
import { ComplainantService } from './complainant.service';

@Component({  
  selector: 'app-complainant',
  templateUrl: './complainant.component.html',
  styleUrls: ['./complainant.component.css']
})  

export class ComplainantComponent implements OnInit {
  readonly optionName: string = 'Complainant';
  readonly colSearch =
  [
      { headerName: 'Id', field: 'complainantId', width: 70 },
      { headerName: 'Complainant Name', field: 'complainantName', },
      { headerName: 'Is Active', field: 'isActive', width: 70},
    ];
  frmComplainant: any;
  footer: agFooter = new agFooter();
  @ViewChild('complainantName', { static: true }) complainantName: ElementRef;
  @ViewChild('complainantId', { static: true }) complainantId: ElementRef;

  constructor(private router:Router, private formbulider: FormBuilder,
    private svcComplainant: ComplainantService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {       
  }  
  
  ngOnInit() {
    this.frmComplainant = this.formbulider.group({
      complainantId: [null, [Validators.required]],
      complainantName: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmComplainant.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmComplainant.reset();
    this.frmComplainant.enable();
    this.frmComplainant.controls.complainantId.disable();
    this.frmComplainant.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.complainantName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmComplainant.controls.complainantId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.complainantId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcComplainant.getComplainants().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Complainant", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.complainantId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmComplainant.enable();
    this.frmComplainant.controls.complainantId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.complainantName.nativeElement.focus();
  }

  tbSave() {
    if (!this.frmComplainant.invalid) {
      this.svcWaitDlg.open({});
      var formData: Complainant = this.frmComplainant.getRawValue();
      formData.footer = this.footer;
      this.svcComplainant.save(formData).subscribe(
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
      this.svcComplainant.get(Id).subscribe(
        complainant => {
          if (complainant) {
            this.frmComplainant.disable();
            this.frmComplainant.controls['complainantId'].setValue(complainant.complainantId);
            this.frmComplainant.controls['complainantName'].setValue(complainant.complainantName);
            this.frmComplainant.controls['isActive'].setValue(complainant.isActive);  
            this.footer = complainant.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close();     });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private initForm() {
    this.frmComplainant.reset();
    this.frmComplainant.disable();
    this.footer = new agFooter();
  }
  //#endregion
}
