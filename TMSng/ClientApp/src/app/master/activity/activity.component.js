"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let ActivityComponent = class ActivityComponent {
    constructor(router, formbulider, svcActivity, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcActivity = svcActivity;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Activity';
        this.colSearch = [
            { headerName: 'Activity Id', field: 'activityId', width: 70 },
            { headerName: 'Activity Name', field: 'activityName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmActivity = this.formbulider.group({
            activityId: [null, [forms_1.Validators.required]],
            activityName: [null, [forms_1.Validators.required]],
            estHRsReq: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmActivity.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmActivity.reset();
        this.frmActivity.enable();
        this.frmActivity.controls.activityId.disable();
        this.frmActivity.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.activityName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmActivity.controls.activityId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.activityId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcActivity.getActivities().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Activity", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.activityId);
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
        this.frmActivity.enable();
        this.frmActivity.controls.activityId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.activityName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmActivity.markAllAsTouched();
            if (!this.frmActivity.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmActivity.getRawValue();
                formData.footer = this.footer;
                this.svcActivity.save(formData).subscribe(() => {
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
            this.svcActivity.get(Id).subscribe(activity => {
                if (activity) {
                    this.frmActivity.disable();
                    this.frmActivity.controls['activityId'].setValue(activity.activityId);
                    this.frmActivity.controls['activityName'].setValue(activity.activityName);
                    this.frmActivity.controls['estHRsReq'].setValue(activity.estHrsReq);
                    this.frmActivity.controls['isActive'].setValue(activity.isActive);
                    this.footer = activity.footer;
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
        this.frmActivity.reset();
        this.frmActivity.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('activityName', { static: true })
], ActivityComponent.prototype, "activityName", void 0);
__decorate([
    core_1.ViewChild('activityId', { static: true })
], ActivityComponent.prototype, "activityId", void 0);
ActivityComponent = __decorate([
    core_1.Component({
        selector: 'app-activity',
        templateUrl: './activity.component.html',
        styleUrls: ['./activity.component.css']
    })
], ActivityComponent);
exports.ActivityComponent = ActivityComponent;
//# sourceMappingURL=activity.component.js.map