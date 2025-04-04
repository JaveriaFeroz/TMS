"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PMComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let PMComponent = class PMComponent {
    //#endregion
    constructor(router, formbulider, svcPM, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcPM = svcPM;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region form variables
        this.optionName = 'Preventive Maintenance';
        this.colSearch = [
            { headerName: 'Id', field: 'pmId', width: 70 },
            { headerName: 'Type', field: 'capacityName', },
            { headerName: 'Make', field: 'assetMakeName' },
            { headerName: 'Activity Type', field: 'activityName', width: 250 },
            { headerName: 'Active?', field: 'isActive', width: 50 },
        ];
        this.footer = new footer_1.agFooter();
        this.errors = [];
    }
    ngOnInit() {
        this.frmPM = this.formbulider.group({
            pmId: [null, [forms_1.Validators.required]],
            capacityId: [null, [forms_1.Validators.required]],
            assetMakeId: [null, [forms_1.Validators.required]],
            activityId: [null, [forms_1.Validators.required]],
            alertKMs: [null, [forms_1.Validators.required]],
            dueKMs: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmPM.disable();
        this.loadLookup();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmPM.reset();
        this.frmPM.enable();
        this.frmPM.controls.pmId.disable();
        this.frmPM.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.activityId.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmPM.controls.pmId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.pmId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcPM.getPMs().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Maintenance Plan", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.pmId);
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
        this.frmPM.enable();
        this.frmPM.controls.pmId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.activityId.focus();
    }
    tbSave() {
        try {
            this.frmPM.markAllAsTouched();
            if (!this.frmPM.invalid) {
                var formData = this.frmPM.getRawValue();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcPM.save(formData).subscribe(() => {
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
            this.svcPM.get(Id).subscribe(pm => {
                if (pm) {
                    this.frmPM.disable();
                    this.frmPM.controls['pmId'].setValue(pm.pmId);
                    this.frmPM.controls['activityId'].setValue(pm.activityId);
                    this.frmPM.controls['capacityId'].setValue(pm.capacityId);
                    this.frmPM.controls['assetMakeId'].setValue(pm.assetMakeId);
                    this.frmPM.controls['alertKMs'].setValue(pm.alertKMs);
                    this.frmPM.controls['dueKMs'].setValue(pm.dueKMs);
                    this.frmPM.controls['isActive'].setValue(pm.isActive);
                    this.footer = pm.footer;
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
    loadLookup() {
        try {
            this.svcPM.getLookUp().subscribe(data => {
                this.lstAssetMake = data.lstAssetMake;
                this.lstCapacity = data.lstCapacity;
                this.lstActivity = data.lstActivity;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(pm) {
        this.errors = [];
        if (pm.dueKMs < pm.alertKMs) {
            this.errors.push('Due KMs can not be less than Alert KMs');
        }
    }
    initForm() {
        this.frmPM.reset();
        this.frmPM.disable();
        this.errors = [];
    }
};
__decorate([
    core_1.ViewChild('activityId', { static: true })
], PMComponent.prototype, "activityId", void 0);
__decorate([
    core_1.ViewChild('pmId', { static: true })
], PMComponent.prototype, "pmId", void 0);
PMComponent = __decorate([
    core_1.Component({
        selector: 'app-pm',
        templateUrl: './pm.component.html',
        styleUrls: ['./pm.component.css']
    })
], PMComponent);
exports.PMComponent = PMComponent;
//# sourceMappingURL=pm.component.js.map