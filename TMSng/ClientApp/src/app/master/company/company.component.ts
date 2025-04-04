import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Company } from './company';
import { CompanyService } from './company.service';

@Component({  
  selector: 'app-company',  
  templateUrl: './company.component.html',  
  styleUrls: ['./company.component.css']  
})  

export class CompanyComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Company';
  readonly colSearch =
  [
      { headerName: 'Id', field: 'companyId', width: 70 },
      { headerName: 'Charge Name', field: 'companyName', },
      { headerName: 'Is Active', field: 'isActive', width: 70 },
    ];
  //#endregion
  frmCompany: any;
  lstAccount: any;
  lstBankAccount: any;
  lstARAccount: any;
  lstAPAccount: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('companyName', { static: true }) companyName: ElementRef;
  @ViewChild('companyId', { static: true }) companyId: ElementRef;

  constructor(private router:Router, private formbulider: FormBuilder,
    private svcCompany: CompanyService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService, private Enum: AgilityEnum) {       
  }  
  
  ngOnInit() {
    this.frmCompany = this.formbulider.group({
      companyId: [null, [Validators.required]],
      companyName: [null, [Validators.required]],
      companyAddress: [null, [Validators.required]],
      ntn: [null, [Validators.required]],
      distanceThreshold: [null, [Validators.required]],
      reportGraceHRs: [null],
      bankAccountId: [null, [Validators.required]],
      arAccountId: [null],
      apAccountId: [null],
      tripRevenueAccountId: [null],
      advanceAccountId: [null],
      enableGL: [null],
      routeByConsignee: [null],
      enablePartialDelivery: [null],
      separateFixedInvoice: [null],
      fuelExpenseAccountId: [null],
      isMandatoryDriver2: [null],
      allowTrailer: [null],
      
    });
    this.loadLookup();
    this.frmCompany.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmCompany.reset();  
    this.frmCompany.enable();
    this.frmCompany.controls.companyId.disable();
    this.frmCompany.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.companyName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmCompany.controls.companyId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.companyId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcCompany.getCompanies().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Company", this.colSearch, r);
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
    this.frmCompany.enable();
    this.frmCompany.controls.companyId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.companyName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmCompany.markAllAsTouched();
      if (!this.frmCompany.invalid) {
        var formData: Company = this.frmCompany.getRawValue();
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcCompany.save(formData).subscribe(
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
      this.svcCompany.get(Id).subscribe(
        company => {
          if (company) {
            this.frmCompany.disable();
            this.frmCompany.controls['companyId'].setValue(company.companyId);
            this.frmCompany.controls['companyName'].setValue(company.companyName);
            this.frmCompany.controls['companyAddress'].setValue(company.companyAddress);
            this.frmCompany.controls['ntn'].setValue(company.ntn);
            this.frmCompany.controls['distanceThreshold'].setValue(company.distanceThreshold);
            this.frmCompany.controls['reportGraceHRs'].setValue(company.reportGraceHRs);
            this.frmCompany.controls['bankAccountId'].setValue(company.bankAccountId);
            this.frmCompany.controls['arAccountId'].setValue(company.arAccountId);
            this.frmCompany.controls['apAccountId'].setValue(company.apAccountId);
            this.frmCompany.controls['tripRevenueAccountId'].setValue(company.tripRevenueAccountId);
            this.frmCompany.controls['advanceAccountId'].setValue(company.advanceAccountId);
            this.frmCompany.controls['enableGL'].setValue(company.enableGL);
            this.frmCompany.controls['routeByConsignee'].setValue(company.routeByConsignee);
            this.frmCompany.controls['enablePartialDelivery'].setValue(company.enablePartialDelivery);
            this.frmCompany.controls['separateFixedInvoice'].setValue(company.separateFixedInvoice);
            this.frmCompany.controls['fuelExpenseAccountId'].setValue(company.fuelExpenseAccountId);
            this.frmCompany.controls['isMandatoryDriver2'].setValue(company.isMandatoryDriver2);
            this.frmCompany.controls['allowTrailer'].setValue(company.allowTrailer);

          
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
      this.svcCompany.getLookup().subscribe(
        data => {
          this.lstAccount = data.lstAccount.filter(x => x.accountTypeId == AgilityEnum.AccountType.Subsidiary);
          this.lstBankAccount = data.lstAccount.filter(x => x.accountTypeId == AgilityEnum.AccountType.Control);
          this.lstARAccount = data.lstAccount.filter(x => x.accountTypeId == AgilityEnum.AccountType.Subsidiary);
          this.lstAPAccount = data.lstAccount.filter(x => x.accountTypeId == AgilityEnum.AccountType.Subsidiary);
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

  private validate(c: Company) {
    this.errors = [];
    if (c.enableGL == true) {
      if (c.bankAccountId == null || c.arAccountId == null || c.apAccountId == null || c.tripRevenueAccountId == null ||
        c.advanceAccountId == null || c.fuelExpenseAccountId == null) {
        this.errors.push('If Allow GL Entries is marked true then BankAccount, ARAccount, APAccount, RWBRevenueAccount, AdvancePayableExpenseAccount And CostFuelAccount must have value ');
      }
    }
    else if (c.enableGL == false) {
      if (c.bankAccountId != null || c.arAccountId != null || c.apAccountId != null || c.tripRevenueAccountId !=  null ||
        c.advanceAccountId != null && c.fuelExpenseAccountId != null) {
        this.errors.push('If Allow GL Entries is marked true then BankAccount, ARAccount, APAccount, RWBRevenueAccount, AdvancePayableExpenseAccount And CostFuelAccount  must have value ');
      }
    }   
  }

  private initForm() {
    this.frmCompany.reset();    
    this.frmCompany.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
