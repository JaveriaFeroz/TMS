"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHTaxExemptionComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let WHTaxExemptionComponent = class WHTaxExemptionComponent {
    constructor(whtaxexemptionr, formbulider, svcWHTExemption, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.whtaxexemptionr = whtaxexemptionr;
        this.formbulider = formbulider;
        this.svcWHTExemption = svcWHTExemption;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'WH Tax Exemption';
        this.colSearch = [
            { headerName: 'Exemption Id', field: 'exemptionId', width: 70 },
            { headerName: 'Date  From', field: 'dateFrom' },
            { headerName: 'Date To', field: 'dateTo' },
        ];
        this.footer = new footer_1.agFooter();
        this.errors = [];
    }
    ngOnInit() {
        this.frmWHTaxExemption = this.formbulider.group({
            exemptionId: [null, [forms_1.Validators.required]],
            dateFrom: [null, [forms_1.Validators.required]],
            dateTo: [null, [forms_1.Validators.required]],
        });
        this.frmWHTaxExemption.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmWHTaxExemption.reset();
        this.frmWHTaxExemption.enable();
        this.frmWHTaxExemption.controls.exemptionId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.dateFrom.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmWHTaxExemption.controls.exemptionId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.exemptionId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcWHTExemption.getExemptions().subscribe(r => {
                this.svcSearchDlg.open("Search & Select WHTaxExemption", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.exemptionId);
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
        this.frmWHTaxExemption.enable();
        this.frmWHTaxExemption.controls.exemptionId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.dateFrom.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmWHTaxExemption.markAllAsTouched();
            if (!this.frmWHTaxExemption.invalid) {
                var formData = this.frmWHTaxExemption.getRawValue();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcWHTExemption.save(formData).subscribe(() => {
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
        this.whtaxexemptionr.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcWHTExemption.get(Id).subscribe(whtaxexemption => {
                if (whtaxexemption) {
                    this.frmWHTaxExemption.disable();
                    this.frmWHTaxExemption.controls['exemptionId'].setValue(whtaxexemption.exemptionId);
                    this.frmWHTaxExemption.controls['dateFrom'].setValue(whtaxexemption.dateFrom);
                    this.frmWHTaxExemption.controls['dateTo'].setValue(whtaxexemption.dateTo);
                    this.footer = whtaxexemption.footer;
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
    validate(WH) {
        this.errors = [];
        if (WH.dateFrom >= WH.dateTo) {
            this.errors.push('Please enter Valid Date as DateFrom cannot be greater then DateTo');
        }
    }
    initForm() {
        this.frmWHTaxExemption.reset();
        this.frmWHTaxExemption.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('dateFrom', { static: true })
], WHTaxExemptionComponent.prototype, "dateFrom", void 0);
__decorate([
    core_1.ViewChild('exemptionId', { static: true })
], WHTaxExemptionComponent.prototype, "exemptionId", void 0);
WHTaxExemptionComponent = __decorate([
    core_1.Component({
        selector: 'app-whtaxexemption',
        templateUrl: './whtaxexemption.component.html',
        styleUrls: ['./whtaxexemption.component.css']
    })
], WHTaxExemptionComponent);
exports.WHTaxExemptionComponent = WHTaxExemptionComponent;
//# sourceMappingURL=whtaxexemption.component.js.map