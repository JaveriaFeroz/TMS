"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COAComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let COAComponent = class COAComponent {
    constructor(router, formbulider, svcCoA, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcCoA = svcCoA;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'COA';
        this.colSearch = [
            { headerName: 'Account Code', field: 'accountCode' },
            { headerName: 'Account Name', field: 'accountName', },
            { headerName: 'Account Type', field: 'accountTypeName' },
            { headerName: 'Parent Account', field: 'parentAccountCode' },
            { headerName: 'HFM Code', field: 'hfmCode' },
            { headerName: 'Is Active', field: 'isActive' },
        ];
        this.maxDate = new Date();
        //Ac: any;
        this.footer = new footer_1.agFooter();
        this.errors = [];
        sessionStorage.removeItem("lstAccount");
        this.loadLookup();
    }
    ngOnInit() {
        this.frmCoA = this.formbulider.group({
            accountCode: [null, [forms_1.Validators.required]],
            parentAccountId: [null],
            parentAccountName: [null],
            accountName: [null, [forms_1.Validators.required]],
            accountTypeId: [null, [forms_1.Validators.required]],
            accountTypeName: [null],
            hfmCode: [null],
            opBalance: [null],
            opBalanceDate: [null, [forms_1.Validators.required]],
            remarks: [null, [forms_1.Validators.required]],
            hierarchy: [null],
            isActive: [null]
        });
        this.frmCoA.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmCoA.reset();
        this.frmCoA.enable();
        this.frmCoA.controls.accountCode.disable();
        this.frmCoA.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.accountName.nativeElement.focus();
    }
    tbEdit() {
        this.frmCoA.enable();
        this.frmCoA.controls.accountCode.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.accountName.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcCoA.getAccounts().subscribe(r => {
                this.svcSearchDlg.open("Search & Select COA", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.accountCode);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbRecall() {
        this.initForm();
        this.frmCoA.controls.accountCode.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.accountCode.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmCoA.markAllAsTouched();
            if (!this.frmCoA.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmCoA.getRawValue();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcCoA.save(formData).subscribe(() => {
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
            this.svcCoA.get(Id).subscribe(coa => {
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
                    this.frmCoA.controls['accountTypeName'].setValue(this.lstAccountType.find(at => { return at.typeId == coa.accountTypeId; }).typeName);
                    this.frmCoA.controls['parentAccountName'].setValue(JSON.parse(sessionStorage.getItem("lstAccount")).find(dt => { return dt.accountId == coa.parentAccountId; }).accountName);
                    //this.onACTypeChanged(coa.accountTypeId);
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
    validate(c) {
        this.errors = [];
        if ((c.accountTypeId < 3 || c.accountTypeId > 3) && c.parentAccountId == null) {
            this.errors.push('Select Parent Account');
        }
        else if ((c.accountTypeId == 3) && c.parentAccountId != null) {
            this.errors.push('Parent Code is not allowed with Type Reporting');
        }
    }
    loadLookup() {
        try {
            this.svcCoA.getLookup().subscribe(data => {
                this.lstAccountType = data.lstAccountType;
                sessionStorage.setItem("lstAccount", JSON.stringify(data.lstAccount));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    onACTypeChanged(accountTypeId) {
        this.lstAccount = JSON.parse(sessionStorage.getItem("lstAccount")).filter(x => x.accountTypeId == accountTypeId - 1);
    }
    initForm() {
        this.frmCoA.reset();
        this.frmCoA.disable();
        this.errors = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('accountName', { static: true })
], COAComponent.prototype, "accountName", void 0);
__decorate([
    core_1.ViewChild('accountCode', { static: true })
], COAComponent.prototype, "accountCode", void 0);
COAComponent = __decorate([
    core_1.Component({
        selector: 'app-coa',
        templateUrl: './coa.component.html',
        styleUrls: ['./coa.component.css']
    })
], COAComponent);
exports.COAComponent = COAComponent;
//# sourceMappingURL=coa.component.js.map