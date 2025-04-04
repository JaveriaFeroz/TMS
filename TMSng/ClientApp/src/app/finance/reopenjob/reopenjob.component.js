"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReOpenJobComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
let ReOpenJobComponent = class ReOpenJobComponent {
    constructor(router, formbulider, svcReopenJob, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcReopenJob = svcReopenJob;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        //#region constant variables
        this.optionName = 'Re Open Job';
        this.errors = [];
    }
    ngOnInit() {
        this.frmReOpenJob = this.formbulider.group({
            jobNo: [null, [forms_1.Validators.required]],
            reason: [null, [forms_1.Validators.required]],
        });
    }
    //#region toolbar functions
    tbSave() {
        try {
            this.frmReOpenJob.markAllAsTouched();
            if (!this.frmReOpenJob.invalid) {
                var formData = this.frmReOpenJob.getRawValue();
                this.svcWaitDlg.open({});
                this.svcReopenJob.reOpen(formData.jobNo, formData.reason).subscribe(() => {
                    this.initForm();
                    // agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
                    this.svcToaster.showSuccess('Job re-opened Successfully');
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
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    initForm() {
        this.frmReOpenJob.reset();
        this.errors = [];
    }
};
ReOpenJobComponent = __decorate([
    core_1.Component({
        selector: 'app-reopenjob',
        templateUrl: './reopenjob.component.html',
        styleUrls: ['./reopenjob.component.css']
    })
], ReOpenJobComponent);
exports.ReOpenJobComponent = ReOpenJobComponent;
//# sourceMappingURL=reopenjob.component.js.map