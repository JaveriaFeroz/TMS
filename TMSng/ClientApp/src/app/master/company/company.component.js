"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const AgilityEnum_1 = require("../../helper/AgilityEnum");
const footer_1 = require("../../helper/footer");
let CompanyComponent = class CompanyComponent {
    constructor(router, formbulider, svcCompany, svcToaster, svcWaitDlg, svcSearchDlg, Enum) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcCompany = svcCompany;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.Enum = Enum;
        //#region constant variables
        this.optionName = 'Company';
        this.colSearch = [
            { headerName: 'Id', field: 'companyId', width: 70 },
            { headerName: 'Charge Name', field: 'companyName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmCompany = this.formbulider.group({
            companyId: [null, [forms_1.Validators.required]],
            companyName: [null, [forms_1.Validators.required]],
            companyAddress: [null, [forms_1.Validators.required]],
            ntn: [null, [forms_1.Validators.required]],
            distanceThreshold: [null, [forms_1.Validators.required]],
            reportGraceHRs: [null],
            bankAccountId: [null, [forms_1.Validators.required]],
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
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmCompany.reset();
        this.frmCompany.enable();
        this.frmCompany.controls.companyId.disable();
        this.frmCompany.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.companyName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmCompany.controls.companyId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.companyId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcCompany.getCompanies().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Company", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.companyId);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbEdit() {
        this.frmCompany.enable();
        this.frmCompany.controls.companyId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.companyName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmCompany.markAllAsTouched();
            if (!this.frmCompany.invalid) {
                var formData = this.frmCompany.getRawValue();
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcCompany.save(formData).subscribe(() => {
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                        this.svcToaster.showSuccess('Record saved Successfully');
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcCompany.get(Id).subscribe(company => {
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
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    loadLookup() {
        try {
            this.svcCompany.getLookup().subscribe(data => {
                this.lstAccount = data.lstAccount.filter(x => x.accountTypeId == AgilityEnum_1.AgilityEnum.AccountType.Subsidiary);
                this.lstBankAccount = data.lstAccount.filter(x => x.accountTypeId == AgilityEnum_1.AgilityEnum.AccountType.Control);
                this.lstARAccount = data.lstAccount.filter(x => x.accountTypeId == AgilityEnum_1.AgilityEnum.AccountType.Subsidiary);
                this.lstAPAccount = data.lstAccount.filter(x => x.accountTypeId == AgilityEnum_1.AgilityEnum.AccountType.Subsidiary);
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(c) {
        this.errors = [];
        if (c.enableGL == true) {
            if (c.bankAccountId == null || c.arAccountId == null || c.apAccountId == null || c.tripRevenueAccountId == null ||
                c.advanceAccountId == null || c.fuelExpenseAccountId == null) {
                this.errors.push('If Allow GL Entries is marked true then BankAccount, ARAccount, APAccount, RWBRevenueAccount, AdvancePayableExpenseAccount And CostFuelAccount must have value ');
            }
        }
        else if (c.enableGL == false) {
            if (c.bankAccountId != null || c.arAccountId != null || c.apAccountId != null || c.tripRevenueAccountId != null ||
                c.advanceAccountId != null && c.fuelExpenseAccountId != null) {
                this.errors.push('If Allow GL Entries is marked true then BankAccount, ARAccount, APAccount, RWBRevenueAccount, AdvancePayableExpenseAccount And CostFuelAccount  must have value ');
            }
        }
    }
    initForm() {
        this.frmCompany.reset();
        this.frmCompany.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('companyName', { static: true })
], CompanyComponent.prototype, "companyName", void 0);
__decorate([
    core_1.ViewChild('companyId', { static: true })
], CompanyComponent.prototype, "companyId", void 0);
CompanyComponent = __decorate([
    core_1.Component({
        selector: 'app-company',
        templateUrl: './company.component.html',
        styleUrls: ['./company.component.css']
    })
], CompanyComponent);
exports.CompanyComponent = CompanyComponent;
//# sourceMappingURL=company.component.js.map