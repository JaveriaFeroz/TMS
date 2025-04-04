import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ExpenseHead } from './expensehead';
import { ExpenseHeadService } from './expensehead.service';

@Component({  
  selector: 'app-expensehead',  
  templateUrl: './expensehead.component.html',  
  styleUrls: ['./expensehead.component.css']  
})  

export class ExpenseHeadComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Expense Head';
  readonly colSearch =
  [
      { headerName: 'Head Id', field: 'expenseId', width: 70 },
      { headerName: 'Head Name', field: 'expenseName', },
      { headerName: 'Is Active', field: 'isActive', width: 70 },
    ];
  //#endregion
  frmExpenseHead: any;
  lstChargeCode: any;
  lstAccount: any;
  enableGLEntries: boolean = false;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('expenseName', { static: true }) expenseName: ElementRef;
  @ViewChild('expenseId', { static: true }) expenseId: ElementRef;

  constructor(private router:Router, private formbulider: FormBuilder,
    private svcExpenseHead: ExpenseHeadService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.enableGLEntries = agFormHelper.enableGL();
  }  
  
  ngOnInit() {
    this.frmExpenseHead = this.formbulider.group({
      expenseId: [null, [Validators.required]],
      expenseName: [null, [Validators.required]],
      chargeCode: [null],
      accountId : [null],
      advAccountId: [null],
      isActive: [null],
      enableGLEntries: [null],
    });
    this.loadLookup();
    this.frmExpenseHead.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    this.frmExpenseHead.patchValue({ enableGLEntries: this.enableGLEntries });
  }

  //#region toolbar functions
  tbAdd() {
    this.frmExpenseHead.reset();
    this.frmExpenseHead.enable();
    this.frmExpenseHead.controls.expenseId.disable();
    this.frmExpenseHead.patchValue({ isActive: true, enableGLEntries: this.enableGLEntries });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.expenseName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmExpenseHead.controls.expenseId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.expenseId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcExpenseHead.getExpenseHeads().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Expense Head", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.expenseId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmExpenseHead.enable();
    this.frmExpenseHead.controls.expenseId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.expenseName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmExpenseHead.markAllAsTouched();
      if (!this.frmExpenseHead.invalid) {
        this.svcWaitDlg.open({});
        var formData: ExpenseHead = this.frmExpenseHead.getRawValue();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcExpenseHead.save(formData).subscribe(
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
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcExpenseHead.get(Id).subscribe(
        eh => {
          if (eh) {
            this.frmExpenseHead.disable();
            this.frmExpenseHead.controls['expenseId'].setValue(Id);
            this.frmExpenseHead.controls['expenseName'].setValue(eh.expenseName);
            this.frmExpenseHead.controls['chargeCode'].setValue(eh.chargeCode);
            this.frmExpenseHead.controls['accountId'].setValue(eh.accountId);
            this.frmExpenseHead.controls['advAccountId'].setValue(eh.advAccountId);
            this.frmExpenseHead.controls['isActive'].setValue(eh.isActive);
            this.frmExpenseHead.controls['enableGLEntries'].setValue(this.enableGLEntries);
            this.footer = eh.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcExpenseHead.getLookup().subscribe(
        data => {
          this.lstChargeCode = data.lstChargeCode;
          this.lstAccount = data.lstAccount.filter(x => x.accountTypeId == AgilityEnum.AccountType.Subsidiary);
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

  private validate(e: ExpenseHead) {
    this.errors = [];
    if (this.enableGLEntries) {
      if (e.accountId == null || e.advAccountId == null) {
        this.errors.push('Expense and Advance Payable account Ids are mandatory');
      }
    }
  }

  private initForm() {
    this.frmExpenseHead.reset();
    this.frmExpenseHead.disable();
    this.frmExpenseHead.patchValue({ enableGLEntries: this.enableGLEntries });
    this.footer = new agFooter();
  }
  //#endregion local functions
}
