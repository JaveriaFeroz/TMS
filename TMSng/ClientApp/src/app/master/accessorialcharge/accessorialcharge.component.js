"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessorialChargeComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let AccessorialChargeComponent = class AccessorialChargeComponent {
    constructor(router, formbulider, svcAccCharge, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcAccCharge = svcAccCharge;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Accessorial Charge';
        this.colSearch = [
            { headerName: 'Acc Charge Id', field: 'chargeId', width: 70 },
            { headerName: 'Acc Charge Name', field: 'chargeName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmAccCharge = this.formbulider.group({
            chargeId: [null, [forms_1.Validators.required]],
            chargeName: [null, [forms_1.Validators.required]],
            ctrlChargeCode: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.loadLookup();
        this.frmAccCharge.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmAccCharge.reset();
        this.frmAccCharge.enable();
        this.frmAccCharge.controls.chargeId.disable();
        this.frmAccCharge.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.chargeName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmAccCharge.controls.chargeId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.chargeId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcAccCharge.getCharges().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Accessorial Charge", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.chargeId);
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
        this.frmAccCharge.enable();
        this.frmAccCharge.controls.chargeId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.chargeName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmAccCharge.markAllAsTouched();
            if (!this.frmAccCharge.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmAccCharge.getRawValue();
                formData.footer = this.footer;
                this.svcAccCharge.save(formData).subscribe(() => {
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
            this.svcAccCharge.get(Id).subscribe(acc => {
                if (acc) {
                    this.frmAccCharge.disable();
                    this.frmAccCharge.controls['chargeId'].setValue(acc.chargeId);
                    this.frmAccCharge.controls['chargeName'].setValue(acc.chargeName);
                    this.frmAccCharge.controls['ctrlChargeCode'].setValue(acc.ctrlChargeCode);
                    this.frmAccCharge.controls['isActive'].setValue(acc.isActive);
                    this.footer = acc.footer;
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
            this.svcAccCharge.getLookup().subscribe(data => {
                this.lstChargeCode = data.lstChargeCode;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmAccCharge.reset();
        this.frmAccCharge.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('chargeName', { static: true })
], AccessorialChargeComponent.prototype, "chargeName", void 0);
__decorate([
    core_1.ViewChild('chargeId', { static: true })
], AccessorialChargeComponent.prototype, "chargeId", void 0);
AccessorialChargeComponent = __decorate([
    core_1.Component({
        selector: 'app-accessorialcharge',
        templateUrl: './accessorialcharge.component.html',
        styleUrls: ['./accessorialcharge.component.css']
    })
], AccessorialChargeComponent);
exports.AccessorialChargeComponent = AccessorialChargeComponent;
//# sourceMappingURL=accessorialcharge.component.js.map