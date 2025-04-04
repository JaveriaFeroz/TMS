"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseHeadComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const AgilityEnum_1 = require("../../helper/AgilityEnum");
const footer_1 = require("../../helper/footer");
let ExpenseHeadComponent = class ExpenseHeadComponent {
    constructor(router, formbulider, svcExpenseHead, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcExpenseHead = svcExpenseHead;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Expense Head';
        this.colSearch = [
            { headerName: 'Head Id', field: 'expenseId', width: 70 },
            { headerName: 'Head Name', field: 'expenseName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.enableGLEntries = false;
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.enableGLEntries = agFormHelper_1.agFormHelper.enableGL();
    }
    ngOnInit() {
        this.frmExpenseHead = this.formbulider.group({
            expenseId: [null, [forms_1.Validators.required]],
            expenseName: [null, [forms_1.Validators.required]],
            chargeCode: [null],
            accountId: [null],
            advAccountId: [null],
            isActive: [null],
            enableGLEntries: [null],
        });
        this.loadLookup();
        this.frmExpenseHead.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        this.frmExpenseHead.patchValue({ enableGLEntries: this.enableGLEntries });
    }
    //#region toolbar functions
    tbAdd() {
        this.frmExpenseHead.reset();
        this.frmExpenseHead.enable();
        this.frmExpenseHead.controls.expenseId.disable();
        this.frmExpenseHead.patchValue({ isActive: true, enableGLEntries: this.enableGLEntries });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.expenseName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmExpenseHead.controls.expenseId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.expenseId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcExpenseHead.getExpenseHeads().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Expense Head", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.expenseId);
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
        this.frmExpenseHead.enable();
        this.frmExpenseHead.controls.expenseId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.expenseName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmExpenseHead.markAllAsTouched();
            if (!this.frmExpenseHead.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmExpenseHead.getRawValue();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcExpenseHead.save(formData).subscribe(() => {
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
            this.svcExpenseHead.get(Id).subscribe(eh => {
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
            this.svcExpenseHead.getLookup().subscribe(data => {
                this.lstChargeCode = data.lstChargeCode;
                this.lstAccount = data.lstAccount.filter(x => x.accountTypeId == AgilityEnum_1.AgilityEnum.AccountType.Subsidiary);
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(e) {
        this.errors = [];
        if (this.enableGLEntries) {
            if (e.accountId == null || e.advAccountId == null) {
                this.errors.push('Expense and Advance Payable account Ids are mandatory');
            }
        }
    }
    initForm() {
        this.frmExpenseHead.reset();
        this.frmExpenseHead.disable();
        this.frmExpenseHead.patchValue({ enableGLEntries: this.enableGLEntries });
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('expenseName', { static: true })
], ExpenseHeadComponent.prototype, "expenseName", void 0);
__decorate([
    core_1.ViewChild('expenseId', { static: true })
], ExpenseHeadComponent.prototype, "expenseId", void 0);
ExpenseHeadComponent = __decorate([
    core_1.Component({
        selector: 'app-expensehead',
        templateUrl: './expensehead.component.html',
        styleUrls: ['./expensehead.component.css']
    })
], ExpenseHeadComponent);
exports.ExpenseHeadComponent = ExpenseHeadComponent;
//# sourceMappingURL=expensehead.component.js.map