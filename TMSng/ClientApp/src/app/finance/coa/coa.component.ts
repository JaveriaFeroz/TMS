import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { CoA } from './coa';
import { COAService } from './coa.service';

@Component({
  selector: 'app-coa',
  templateUrl: './coa.component.html',
  styleUrls: ['./coa.component.css']
})

export class COAComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'COA';
  readonly colSearch =
    [
      { headerName: 'Account Code', field: 'accountCode' },
      { headerName: 'Account Name', field: 'accountName', },
      { headerName: 'Account Type', field: 'accountTypeName'},
      { headerName: 'Parent Account', field: 'parentAccountCode' },
      { headerName: 'HFM Code', field: 'hfmCode' },
      { headerName: 'Is Active', field: 'isActive' },
    ];
  //#endregion
  frmCoA: any;
  maxDate = new Date();
  lstAccount: any[];
  //Ac: any;
  footer: agFooter = new agFooter();
  errors: string[] = [];
  lstAccountType: any[];
  @ViewChild('accountName', { static: true }) accountName: ElementRef;
  @ViewChild('accountCode', { static: true }) accountCode: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcCoA: COAService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    sessionStorage.removeItem("lstAccount");
    this.loadLookup();
  }

  ngOnInit() {
    this.frmCoA = this.formbulider.group({
      accountCode: [null, [Validators.required]],
      parentAccountId: [null],
      parentAccountName: [null],
      accountName: [null, [Validators.required]],
      accountTypeId: [null, [Validators.required]],
      accountTypeName: [null],
      hfmCode: [null],
      opBalance: [null ],
      opBalanceDate: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
      hierarchy: [null],
      isActive: [null]
    });
    this.frmCoA.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmCoA.reset();
    this.frmCoA.enable();
    this.frmCoA.controls.accountCode.disable();
    this.frmCoA.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.accountName.nativeElement.focus();
  }

  tbEdit() {
    this.frmCoA.enable();
    this.frmCoA.controls.accountCode.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.accountName.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcCoA.getAccounts().subscribe(r => {
        this.svcSearchDlg.open("Search & Select COA", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.accountCode);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbRecall() {
    this.initForm();
    this.frmCoA.controls.accountCode.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.accountCode.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmCoA.markAllAsTouched();
      if (!this.frmCoA.invalid) {
        this.svcWaitDlg.open({});
        var formData: CoA = this.frmCoA.getRawValue();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return }
        else {
          this.svcCoA.save(formData).subscribe(
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
  get(Id: string) {
    this.svcWaitDlg.open({});
    try {
      this.svcCoA.get(Id).subscribe(
        coa => {
          if (coa) {
            this.frmCoA.disable();
            this.frmCoA.controls['accountCode'].setValue(coa.accountCode);
            this.frmCoA.controls['parentAccountId'].setValue(coa.parentAccountId);
            this.frmCoA.controls['accountName'].setValue(coa.accountName);
            this.frmCoA.controls['accountTypeId'].setValue(coa.accountTypeId);
            this.frmCoA.controls['hfmCode'].setValue(coa.hfmCode);
            this.frmCoA.controls['opBalance'].setValue(coa.opBalance);
            this.frmCoA.controls['opBalanceDate'].setValue(new Date(coa.opBalanceDate));
            this.frmCoA.controls['remarks'].setValue(coa.remarks);
            this.frmCoA.controls['hierarchy'].setValue(coa.hierarchy);
            this.frmCoA.controls['isActive'].setValue(coa.isActive);  
            this.footer = coa.footer;
            this.frmCoA.controls['accountTypeName'].setValue(this.lstAccountType.find(at => { return at.typeId == coa.accountTypeId }).typeName);
            if (coa.accountTypeId != 1) {
              this.frmCoA.controls['parentAccountName'].setValue(
                JSON.parse(sessionStorage.getItem("lstAccount")).find(dt => { return dt.accountId == coa.parentAccountId }).accountName);
            }
           
            //this.onACTypeChanged(coa.accountTypeId);
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private validate(c: CoA) {
    this.errors = [];
    if ((c.accountTypeId < 3 || c.accountTypeId > 3) && c.parentAccountId == null) {
      this.errors.push('Select Parent Account');
    }
    else if ((c.accountTypeId == 3) && c.parentAccountId != null) {
      this.errors.push('Parent Code is not allowed with Type Reporting');
    }
  }

  private loadLookup() {
    try {
      this.svcCoA.getLookup().subscribe(
        data => {
          this.lstAccountType = data.lstAccountType;
          sessionStorage.setItem("lstAccount", JSON.stringify(data.lstAccount));          
        },
        error => {
          this.svcToaster.showFailure(error);
        }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }       
  }

  onACTypeChanged(accountTypeId) {
    this.lstAccount = JSON.parse(sessionStorage.getItem("lstAccount")).filter(x => x.accountTypeId == accountTypeId - 1);
  }

  private initForm() {
    this.frmCoA.reset();    
    this.frmCoA.disable();
    this.errors = [];
    this.footer = new agFooter();
  }
  //#endregion local functions
}
