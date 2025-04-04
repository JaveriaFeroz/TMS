"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceChargeComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let MaintenanceChargeComponent = class MaintenanceChargeComponent {
    constructor(router, formbulider, chargeService, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.chargeService = chargeService;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Maintenance Charge';
        this.colSearch = [
            { headerName: 'Charge Id', field: 'chargeId', width: 70 },
            { headerName: 'Charge Name', field: 'chargeName', },
            { headerName: 'Is Active', field: 'isActive', },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmMaintenanceCharge = this.formbulider.group({
            chargeId: [null, [forms_1.Validators.required]],
            chargeName: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmMaintenanceCharge.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmMaintenanceCharge.reset();
        this.frmMaintenanceCharge.enable();
        this.frmMaintenanceCharge.controls.chargeId.disable();
        this.frmMaintenanceCharge.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.chargeName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmMaintenanceCharge.controls.chargeId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.chargeId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.chargeService.GetMaintenanceCharges().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Non Inventory Product", this.colSearch, r);
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
        this.frmMaintenanceCharge.enable();
        this.frmMaintenanceCharge.controls.chargeId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.chargeName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmMaintenanceCharge.markAllAsTouched();
            if (!this.frmMaintenanceCharge.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmMaintenanceCharge.getRawValue();
                formData.footer = this.footer;
                this.chargeService.Save(formData).subscribe(() => {
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
            this.chargeService.Get(Id).subscribe(charge => {
                if (charge) {
                    this.frmMaintenanceCharge.disable();
                    this.frmMaintenanceCharge.controls['chargeId'].setValue(charge.chargeId);
                    this.frmMaintenanceCharge.controls['chargeName'].setValue(charge.chargeName);
                    this.frmMaintenanceCharge.controls['isActive'].setValue(charge.isActive);
                    this.footer = charge.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmMaintenanceCharge.reset();
        this.frmMaintenanceCharge.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('chargeName', { static: true })
], MaintenanceChargeComponent.prototype, "chargeName", void 0);
__decorate([
    core_1.ViewChild('chargeId', { static: true })
], MaintenanceChargeComponent.prototype, "chargeId", void 0);
MaintenanceChargeComponent = __decorate([
    core_1.Component({
        selector: 'app-maintenancecharge',
        templateUrl: './maintenancecharge.component.html',
        styleUrls: ['./maintenancecharge.component.css']
    })
], MaintenanceChargeComponent);
exports.MaintenanceChargeComponent = MaintenanceChargeComponent;
//# sourceMappingURL=maintenancecharge.component.js.map