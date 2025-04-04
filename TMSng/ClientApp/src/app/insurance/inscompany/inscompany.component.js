"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsCompanyComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let InsCompanyComponent = class InsCompanyComponent {
    constructor(router, formbulider, svcInsCompany, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcInsCompany = svcInsCompany;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Insurance Company';
        this.colSearch = [
            { headerName: 'Company', field: 'companyId', width: 70 },
            { headerName: 'Company Name', field: 'companyName', },
            { headerName: 'Is Active', field: 'isActive', },
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmInsCompany = this.formbulider.group({
            companyId: [null, [forms_1.Validators.required]],
            companyName: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmInsCompany.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmInsCompany.reset();
        this.frmInsCompany.enable();
        this.frmInsCompany.controls.companyId.disable();
        this.frmInsCompany.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.companyName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmInsCompany.controls.companyId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.companyId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcInsCompany.getInsCompanies().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Insurance Company", this.colSearch, r);
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
        this.frmInsCompany.enable();
        this.frmInsCompany.controls.companyId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.companyName.nativeElement.focus();
    }
    tbSave() {
        this.frmInsCompany.markAllAsTouched();
        if (!this.frmInsCompany.invalid) {
            this.svcWaitDlg.open({});
            var formData = this.frmInsCompany.getRawValue();
            formData.footer = this.footer;
            this.svcInsCompany.save(formData).subscribe(() => {
                this.initForm();
                agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                this.svcToaster.showSuccess('Record saved Successfully');
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
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
            this.svcInsCompany.get(Id).subscribe(inscompany => {
                if (inscompany) {
                    this.frmInsCompany.disable();
                    this.frmInsCompany.controls['companyId'].setValue(inscompany.companyId);
                    this.frmInsCompany.controls['companyName'].setValue(inscompany.companyName);
                    this.frmInsCompany.controls['isActive'].setValue(inscompany.isActive);
                    this.footer = inscompany.footer;
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
    initForm() {
        this.frmInsCompany.reset();
        this.frmInsCompany.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('companyName', { static: true })
], InsCompanyComponent.prototype, "companyName", void 0);
__decorate([
    core_1.ViewChild('companyId', { static: true })
], InsCompanyComponent.prototype, "companyId", void 0);
InsCompanyComponent = __decorate([
    core_1.Component({
        selector: 'app-inscompany',
        templateUrl: './inscompany.component.html',
        styleUrls: ['./inscompany.component.css']
    })
], InsCompanyComponent);
exports.InsCompanyComponent = InsCompanyComponent;
//# sourceMappingURL=inscompany.component.js.map