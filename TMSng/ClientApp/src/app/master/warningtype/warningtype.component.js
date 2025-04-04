"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarningTypeComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let WarningTypeComponent = class WarningTypeComponent {
    constructor(router, formbulider, svcWarningType, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcWarningType = svcWarningType;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Warning Type';
        this.colSearch = [
            { headerName: 'Type Id', field: 'typeId', width: 70 },
            { headerName: 'Type Name', field: 'typeName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmWarningType = this.formbulider.group({
            typeId: [null, [forms_1.Validators.required]],
            typeName: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmWarningType.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmWarningType.reset();
        this.frmWarningType.enable();
        this.frmWarningType.controls.typeId.disable();
        this.frmWarningType.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.typeName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmWarningType.controls.typeId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.typeId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcWarningType.getWarningTypes().subscribe(r => {
                this.svcSearchDlg.open("Search & Select WarningType", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.typeId);
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
        this.frmWarningType.enable();
        this.frmWarningType.controls.typeId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.typeName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmWarningType.markAllAsTouched();
            if (!this.frmWarningType.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmWarningType.getRawValue();
                formData.footer = this.footer;
                this.svcWarningType.save(formData).subscribe(() => {
                    this.initForm();
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                    this.svcToaster.showSuccess('Record saved Successfully');
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
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
            this.svcWarningType.get(Id).subscribe(warningtype => {
                if (warningtype) {
                    this.frmWarningType.disable();
                    this.frmWarningType.controls['typeId'].setValue(warningtype.typeId);
                    this.frmWarningType.controls['typeName'].setValue(warningtype.typeName);
                    this.frmWarningType.controls['isActive'].setValue(warningtype.isActive);
                    this.footer = warningtype.footer;
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
        this.frmWarningType.reset();
        this.frmWarningType.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('typeName', { static: true })
], WarningTypeComponent.prototype, "typeName", void 0);
__decorate([
    core_1.ViewChild('typeId', { static: true })
], WarningTypeComponent.prototype, "typeId", void 0);
WarningTypeComponent = __decorate([
    core_1.Component({
        selector: 'app-warningtype',
        templateUrl: './warningtype.component.html',
        styleUrls: ['./warningtype.component.css']
    })
], WarningTypeComponent);
exports.WarningTypeComponent = WarningTypeComponent;
//# sourceMappingURL=warningtype.component.js.map