import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { InsCompany } from './inscompany';
import { InsCompanyService } from './inscompany.service';

@Component({
  selector: 'app-inscompany',
  templateUrl: './inscompany.component.html',
  styleUrls: ['./inscompany.component.css']
})

export class InsCompanyComponent implements OnInit {
  //#region form variables
  readonly optionName: string = 'Insurance Company';
  readonly colSearch =
    [
      { headerName: 'Company', field: 'companyId', width: 70 },
      { headerName: 'Company Name', field: 'companyName', },
      { headerName: 'Is Active', field: 'isActive', width: 70},
    ];
  frmInsCompany: any;
  footer: agFooter = new agFooter();
  @ViewChild('companyName', { static: true }) companyName: ElementRef;
  @ViewChild('companyId', { static: true }) companyId: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcInsCompany: InsCompanyService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmInsCompany = this.formbulider.group({
      companyId: [null, [Validators.required]],
      companyName: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmInsCompany.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmInsCompany.reset();
    this.frmInsCompany.enable();
    this.frmInsCompany.controls.companyId.disable();
    this.frmInsCompany.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.companyName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmInsCompany.controls.companyId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.companyId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcInsCompany.getInsCompanies().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Insurance Company", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.companyId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmInsCompany.enable();
    this.frmInsCompany.controls.companyId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.companyName.nativeElement.focus();
  }

  tbSave() {
    this.frmInsCompany.markAllAsTouched();
    if (!this.frmInsCompany.invalid) {
      this.svcWaitDlg.open({});
      var formData: InsCompany = this.frmInsCompany.getRawValue();
      formData.footer = this.footer;
      this.svcInsCompany.save(formData).subscribe(
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
      this.svcInsCompany.get(Id).subscribe(
        inscompany => {
          if (inscompany) {
            this.frmInsCompany.disable();
            this.frmInsCompany.controls['companyId'].setValue(inscompany.companyId);
            this.frmInsCompany.controls['companyName'].setValue(inscompany.companyName);
            this.frmInsCompany.controls['isActive'].setValue(inscompany.isActive);
            this.footer = inscompany.footer;
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
    this.frmInsCompany.reset();    
    this.frmInsCompany.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
